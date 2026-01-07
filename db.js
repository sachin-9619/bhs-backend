const mysql = require("mysql2/promise");

// 🔐 Safety check
if (!process.env.MYSQL_URL) {
  console.error("❌ MYSQL_URL missing in environment variables");
  process.exit(1);
}
app.get("/", (req, res) => {
  if (!isReady) return res.status(503).send("⏳ Starting...");
  res.status(200).send("🚀 BHS Backend is LIVE");
});

// 🔗 Pool via Railway MYSQL_URL
const pool = mysql.createPool(process.env.MYSQL_URL);

async function initDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("✅ DB connected via MYSQL_URL");

    // ================= ADMINS =================
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // ================= ROUTES =================
    await conn.query(`
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
      ) ENGINE=InnoDB
    `);

    // ================= ROUTE POINTS =================
    await conn.query(`
      CREATE TABLE IF NOT EXISTS route_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT,
        city VARCHAR(100),
        time VARCHAR(20),
        FOREIGN KEY (route_id) REFERENCES routes(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // ================= BOOKINGS =================
    await conn.query(`
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
        FOREIGN KEY (route_id) REFERENCES routes(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // ================= CONTACTS =================
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        subject VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    console.log("🎉 All tables created / verified successfully");

  } catch (err) {
    console.error("❌ DB init failed:", err);
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, initDB };
