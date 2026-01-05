const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});

const db = mysql.createPool(process.env.MYSQL_URL);

// 🔥 IMPORTANT: actual error log karo
async function connectDB() {
  try {
    const conn = await db.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB ERROR:", err.code, err.message);
    setTimeout(connectDB, 3);
  }
}

connectDB();

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("🚀 Server running on port 8080");
});
