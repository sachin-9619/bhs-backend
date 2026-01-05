const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

// Always-alive route
app.get("/ping", (req, res) => res.send("pong"));

// DB Pool
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT),
  waitForConnections: true,
  connectionLimit: 10,
});

// Non-blocking DB connect
async function connectDB() {
  try {
    await db.query("SELECT 1");
    console.log("✅ DB connected");
  } catch {
    console.error("❌ DB not ready, retrying in 3s...");
    setTimeout(connectDB, 3000);
  }
}
connectDB();

// API
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings LIMIT 10");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
