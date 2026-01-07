const express = require("express");
const { initDB } = require("./db");

const app = express();
app.use(express.json());

initDB();

app.get("/", (req, res) => {
  res.send("Backend + DB ready 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 listening"));
