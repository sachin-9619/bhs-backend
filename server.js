const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

// ================= DB Connection (Railway Correct Way) =================
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ================= Debug =================
console.log("DB CONFIG:", {
  host: !!process.env.MYSQLHOST,
  user: !!process.env.MYSQLUSER,
  db: !!process.env.MYSQLDATABASE,
});

// ================= Routes =================
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    res.json({ status: "ok", test: rows });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
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

// ================= Start Server =================
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
