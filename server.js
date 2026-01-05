const express = require("express");
const mysql = require("mysql2/promise");
const { URL } = require("url");

const app = express();
app.use(express.json());

const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: "railway", // 🔥 IMPORTANT
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("MYSQL_URL present:", !!process.env.MYSQL_URL);

app.get("/", (req, res) => {
  res.send("Backend is running! Use /ping or /api/bookings");
});

app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    res.json({ status: "ok", test: rows });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings LIMIT 10");
    res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
