const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

/* ================================
   ✅ DB POOL (Railway compatible)
================================ */
const pool = mysql.createPool(process.env.MYSQL_URL);

/* ================================
   📩 SAVE CONTACT MESSAGE
================================ */
router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    await pool.execute(
      `INSERT INTO contacts 
      (first_name, last_name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, subject, message]
    );

    res.json({
      success: true,
      message: "Message saved successfully",
    });
  } catch (err) {
    console.error("CONTACT DB ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

/* ================================
   🧑‍💻 ADMIN – GET ALL MESSAGES
================================ */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, first_name, last_name, email, phone, subject, message, created_at
       FROM contacts
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================================
   🗑️ DELETE MESSAGE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM contacts WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
