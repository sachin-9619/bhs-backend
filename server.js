const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.get("/ping", (req, res) => res.send("pong"));

const encodedPassword = encodeURIComponent(
  "zWnHlTNWODYLIjBTwivIPlGLendZTPsB"
);

const MYSQL_URL = `mysql://railway:zWnHlTNWODYLIjBTwivIPlGLendZTPsB@mysql-4kxk.railway.internal:3306/railway`;

const db = mysql.createPool(MYSQL_URL);

async function connectDB() {
  try {
    const conn = await db.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB ERROR:", err.code, err.message);
  }
}

connectDB();

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("🚀 Server running on port 8080");
});
