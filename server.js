const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/ping", (req, res) => res.send("pong"));

let db;

async function connectDB() {
  try {
    if (!process.env.MYSQL_URL) {
      console.log("⚠️ MYSQL_URL not found");
      return;
    }

    const dbUrl = new URL(process.env.MYSQL_URL);

    db = mysql.createPool({
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace("/", ""),
      port: dbUrl.port,
      waitForConnections: true,
      connectionLimit: 10,
    });

    await db.query("SELECT 1");
    console.log("✅ DB connected (Railway MySQL)");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
  }
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = db;
