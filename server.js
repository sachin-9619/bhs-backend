// server.js
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config(); // optional locally

const app = express();
app.use(express.json());

// ======== ENV & PORT ========
const PORT = process.env.PORT || 5000;

console.log("🚀 Starting server...");
console.log("Using env variables:", {
  host: process.env.DB_HOST ? "✅" : "❌",
  user: process.env.DB_USER ? "✅" : "❌",
  database: process.env.DB_NAME ? "✅" : "❌",
  port: process.env.DB_PORT ? "✅" : "❌",
});

// ======== MySQL Connection Pool ========
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ======== Test DB Connection ========
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Connected to MySQL!");
    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1); // stops server if DB fails
  }
})();

// ======== Simple Ping Route ========
app.get("/ping", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// ======== Start Server ========
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = db; // optional: for routes
