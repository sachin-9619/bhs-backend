// server.js
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Create Express app
const app = express();
app.use(express.json());

// Simple ping endpoint
app.get("/ping", (req, res) => res.send("pong"));

// DB connection setup
const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
});
console.log("DEBUG MYSQL_URL:", process.env.MYSQL_URL);

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

// Export DB pool for other modules
module.exports = db;
