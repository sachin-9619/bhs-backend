const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    // Ensure username lowercase match
    const [rows] = await pool.query("SELECT * FROM admins WHERE LOWER(username)=?", [
      username.toLowerCase(),
    ]);

    if (!rows.length)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Admin login failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
