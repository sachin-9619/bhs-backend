require("dotenv").config();
const app = require("./app");
const { initDB } = require("./db");

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT not set");

// 🚀 START SERVER FIRST (VERY IMPORTANT)
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 listening on", PORT);
});

// 🔁 INIT DB IN BACKGROUND
(async () => {
  try {
    await initDB();
    console.log("✅ DB ready");
  } catch (err) {
    console.error("❌ DB init failed", err);
  }
})();
