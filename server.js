const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.get("/ping", (req, res) => res.send("pong"));

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

async function connectDB() {
  try {
    const conn = await db.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB ERROR:", err.code, err.message);
    setTimeout(connectDB, 3000);
  }
}

connectDB();

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("🚀 Server running on port 8080");
});
