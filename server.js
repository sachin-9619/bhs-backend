
const app = require("./app"); // your Express app

const PORT = process.env.PORT || 5000; // Railway automatically provides PORT
const MYSQL_URL = process.env.MYSQL_URL;

if (!MYSQL_URL) {
  console.error("❌ MYSQL_URL is not defined. Please set it in your environment variables.");
  process.exit(1);
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
