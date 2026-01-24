const express = require("express");
const router = express.Router();
const { pool } = require("../db"); // ✅ shared pg pool

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
    await pool.query(
      `
      INSERT INTO contacts
      (first_name, last_name, email, phone, subject, message)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [firstName, lastName, email, phone, subject, message]
    );

    res.json({
      success: true,
      message: "Message saved successfully",
    });
  } catch (err) {
    console.error("❌ CONTACT DB ERROR:", err);
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
    const result = await pool.query(
      `
      SELECT id, first_name, last_name, email, phone, subject, message, created_at
      FROM contacts
      ORDER BY created_at DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ FETCH CONTACTS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ================================
   🗑️ DELETE MESSAGE
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM contacts WHERE id = $1",
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ DELETE CONTACT ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
