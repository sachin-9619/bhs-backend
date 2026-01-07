const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDB() {
  try {
    /* ================= ADMINS ================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* ================= ROUTES ================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_name VARCHAR(100),
        bus_type VARCHAR(50),
        departure VARCHAR(100),
        destination VARCHAR(100),
        departure_time VARCHAR(20),
        arrival_time VARCHAR(20),
        duration VARCHAR(20),
        price INT,
        available_seats INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* ================= ROUTE POINTS ================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS route_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT,
        city VARCHAR(100),
        time VARCHAR(20),
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      )
    `);

    /* ================= BOOKINGS ================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT,
        seat_number INT,
        user_name VARCHAR(100),
        phone VARCHAR(20),
        amount INT,
        status VARCHAR(30),
        travel_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(100),
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      )
    `);

    /* ================= CONTACTS ================= */
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        subject VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ All tables verified / auto-created");
  } catch (err) {
    console.error("❌ DB init failed:", err.message);
  }
}

module.exports = { pool, initDB };
