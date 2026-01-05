const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

// Simple ping endpoint
app.get("/ping", (req, res) => res.send("pong"));

// === DB CONNECTION ===
// Use your Railway public URL here
// You can either use process.env.MYSQL_PUBLIC_URL or construct manually
// For example, if your public URL is something like:
// mysql://railway:password@containers-us-west-123.railway.app:port/railway

const MYSQL_HOST = process.env.DB_HOST || "mysql-4kxk.railway.internal"; // internal for Railway deployment
const MYSQL_PORT = process.env.DB_PORT || 3306;
const MYSQL_USER = process.env.DB_USER || "railway";
const MYSQL_PASSWORD = process.env.DB_PASSWORD || "zWnHlTNWODYLIjBTwivIPlGLendZTPsB";
const MYSQL_DATABASE = process.env.DB_NAME || "railway";

// Create connection pool
const db = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
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
    console.log("✅ DB connected");
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

// Export db if you want to use it in routes
module.exports = db;
