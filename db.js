if (!process.env.MYSQL_URL) {
  throw new Error("❌ MYSQL_URL missing in Railway variables!");
}

const mysql = require("mysql2/promise");

// ✅ Railway MySQL FIX
const pool = mysql.createPool({
  uri: process.env.MYSQL_URL,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test connection
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
