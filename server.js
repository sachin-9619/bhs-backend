const express = require("express");
const mysql = require("mysql2/promise");
const { URL } = require("url");

const app = express();
app.use(express.json());

console.log("MYSQL_URL present:", !!process.env.MYSQL_URL);

const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createPool({
  host: dbUrl.hostname,
  user: "railway", // VERY IMPORTANT
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
    process.exit(1); // IMPORTANT
  }
})();
