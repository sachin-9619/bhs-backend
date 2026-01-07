require("dotenv").config(); // sabse upar

const app = require("./app");
const { initDB } = require("./db");

(async () => {
  try {
    await initDB();
    console.log("✅ DB ready");
  } catch (err) {
    console.error("❌ DB init failed", err);
    process.exit(1); // 🔥 important: fail fast
  }
})();

const PORT = process.env.PORT; // ❗ NO fallback

if (!PORT) {
  throw new Error("❌ PORT not provided by environment");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 listening on", PORT);
});
