const mysql = require("mysql2/promise");

if (!process.env.MYSQL_URL) {
  throw new Error("❌ MYSQL_URL missing");
}

// 🔥 FIX: Encode password safely
const dbUrl = new URL(process.env.MYSQL_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password), // 🔥 MAIN FIX
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected successfully");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
})();

module.exports = pool;
