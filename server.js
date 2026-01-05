const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: process.env.NODE_ENV === "production" ? ".env" : ".env.local" });

const app = express();
app.use(express.json());

// Simple ping
app.get("/ping", (req, res) => res.send("pong"));

// DB connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection
async function connectDB() {
  try {
    const conn = await db.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log(`✅ DB connected (${process.env.NODE_ENV || "local"})`);
  } catch (err) {
    console.error("❌ DB ERROR:", err.code, err.sqlMessage || err.message);
  }
}

connectDB();

// Start server
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = db;
