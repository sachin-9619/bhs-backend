const { Pool } = require("pg");
const bcrypt = require("bcrypt");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  const client = await pool.connect();
  try {
    console.log("✅ Postgres connected");

    /* ================= ADMINS ================= */
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const admin = await client.query(
      "SELECT * FROM admins WHERE username=$1",
      ["admin"]
    );

    if (admin.rows.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await client.query(
        "INSERT INTO admins (username, password) VALUES ($1,$2)",
        ["admin", hash]
      );
      console.log("✅ Admin created");
    }

    /* ================= ROUTES ================= */
    await client.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        bus_name TEXT,
        bus_type TEXT,
        departure TEXT,
        destination TEXT,
        departure_time TEXT,
        arrival_time TEXT,
        duration TEXT,
        price INT,
        available_seats INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const routeCount = await client.query("SELECT COUNT(*) FROM routes");
    if (routeCount.rows[0].count === "0") {
      await client.query(`
        INSERT INTO routes
        (bus_name, bus_type, departure, destination, departure_time, arrival_time, duration, price, available_seats)
        VALUES
        ('Day Rider','AC','Solapur','Pune','08:00','13:00','5h',500,40),
        ('Morning Express','Non-AC','Solapur','Pune','06:00','11:30','5h30m',450,30),
        ('Shivneri Deluxe','AC','Solapur','Pune','14:00','19:00','5h',550,40),
        ('Night Sleeper','Sleeper','Solapur','Pune','23:30','05:00','5h30m',700,35),
        ('Evening Rider','AC','Pune','Solapur','15:00','20:00','5h',500,40),
        ('Early Morning','Non-AC','Pune','Solapur','05:30','11:00','5h30m',450,30)
      `);
      console.log("🎉 Routes inserted");
    }

    /* ================= ROUTE POINTS ================= */
    await client.query(`
      CREATE TABLE IF NOT EXISTS route_points (
        id SERIAL PRIMARY KEY,
        route_id INT REFERENCES routes(id) ON DELETE CASCADE,
        city TEXT,
        time TEXT
      )
    `);

    const pointCount = await client.query("SELECT COUNT(*) FROM route_points");
    if (pointCount.rows[0].count === "0") {
      await client.query(`
        INSERT INTO route_points (route_id, city, time) VALUES
        (1,'Pandharpur','09:30'),
        (1,'Indapur','11:00'),
        (2,'Mohol','07:00'),
        (2,'Indapur','09:30'),
        (3,'Tembhurni','15:30'),
        (3,'Indapur','17:00')
      `);
      console.log("🎉 Route points inserted");
    }

    /* ================= BOOKINGS ================= */
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        route_id INT REFERENCES routes(id) ON DELETE CASCADE,
        seat_number INT,
        user_name TEXT,
        phone TEXT,
        email TEXT,
        amount INT,
        status TEXT,
        travel_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /* ================= CONTACTS ================= */
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        subject TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("🎉 ALL TABLES + ALL DATA READY");

  } catch (err) {
    console.error("❌ DB init failed:", err);
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
