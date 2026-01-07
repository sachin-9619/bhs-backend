const app = require("./app");
const { initDB } = require("./db");

(async () => {
  try {
    await initDB();
    console.log("✅ DB ready");
  } catch (err) {
    console.error("❌ DB init failed", err);
  }
})();

const PORT = process.env.PORT || 8080;

// 🔥 VERY IMPORTANT: 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 listening on", PORT);
});
