const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected successfully");
  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }
})();

module.exports = pool;
