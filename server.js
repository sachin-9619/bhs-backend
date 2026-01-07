// server.js
const app = require("./app");      // import Express app with routes & CORS
const mysql = require("mysql2/promise");
require("dotenv").config();

// ================= START SERVER =================
const PORT = process.env.PORT || process.env.LOCAL_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


