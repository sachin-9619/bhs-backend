const app = require("./app");
const express = require("express");
const { initDB } = require("./db");

app.use(express.json());

// 🔥 AUTO INIT DB
initDB();

app.get("/", (req, res) => {
  res.send("Backend running + DB ready 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 listening");
});
