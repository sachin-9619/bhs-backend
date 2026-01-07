
const dbUrl = new URL(process.env.MYSQL_URL);
if (!process.env.MYSQL_URL) {
  throw new Error("❌ MYSQL_URL missing in .env or Railway variables!");
}
const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.MYSQL_URL);

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
})();

module.exports = pool;