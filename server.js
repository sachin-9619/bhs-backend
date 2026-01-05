// server.js
const express = require("express");
const mysql = require("mysql2/promise");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local', override: false });
}

const app = express();
app.use(express.json());

const db = mysql.createPool(process.env.MYSQL_URL);

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
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
