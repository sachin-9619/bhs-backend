// server.js
require("dotenv").config();
const app = require("./app");
const db = require("./models/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ DB connected (production)");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
});
