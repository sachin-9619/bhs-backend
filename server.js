// server.js
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(express.json());

// ================= DB Connection =================
const db = mysql.createPool({
  host: process.env.DB_HOST,      // railway ENV
  user: process.env.DB_USER,      // railway
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// ================= Debug Logs =================
console.log("🚀 DB_USER:", process.env.DB_USER);
console.log("🚀 DB_HOST:", process.env.DB_HOST);
console.log("🚀 DB_NAME:", process.env.DB_NAME);

// ================= Minimal Test Route =================
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    res.json({ status: "ok", test: rows });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= Example Bookings Route =================
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings LIMIT 10");
    res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= Start Server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
