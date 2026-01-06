// server.js
const app = require("./app");      // import Express app with routes & CORS
const mysql = require("mysql2/promise");
require("dotenv").config();

// ================= DB SETUP =================
const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// ================= START SERVER =================
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================= EXPORT DB =================
module.exports = db;
