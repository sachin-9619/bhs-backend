const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

// ================= ALWAYS-ALIVE ROUTE =================
app.get("/ping", (req, res) => res.send("pong"));

// ================= DB POOL =================
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT),
  waitForConnections: true,
  connectionLimit: 10,
});

// ================= NON-BLOCKING DB CONNECT =================
async function connectDB() {
  try {
    await db.query("SELECT 1");
    console.log("✅ DB connected");
  } catch {
    console.error("❌ DB not ready, retrying in 3s...");  }
}
connectDB();

// ================= SAMPLE API =================
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings LIMIT 10");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================= KEEP CONTAINER ALIVE =================
setInterval(() => {}, 1 << 30);
