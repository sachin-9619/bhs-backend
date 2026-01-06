const app = require("./app");
const mysql = require("mysql2/promise");
require("dotenv").config();

app.use(express.json());

// Simple ping
app.get("/ping", (req, res) => res.send("pong"));


// Start server
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


