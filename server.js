const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

console.log("DB ENV CHECK:", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

// ✅ USE RAILWAY PROVIDED VARS
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
});

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/ping", async (req, res) => {
  const [rows] = await db.query("SELECT 1 AS test");
  res.json({ status: "ok", test: rows });
});

/* ---------- SAFE START ---------- */
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    console.log("Testing DB connection...");
    await db.query("SELECT 1");
    console.log("✅ DB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ FATAL DB ERROR:", err.message);
    process.exit(1);
  }
})();
