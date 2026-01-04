const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- DB CONNECTION ----------
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

// ---------- TEST ROUTE ----------
app.get("/ping", (req, res) => {
  res.send("Backend alive 🚀");
});

// ---------- BOOKINGS ROUTE ----------
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT b.id, b.userName, b.phone, b.seats, r.busName, r.departure, r.destination, r.departureTime
      FROM bookings b
      LEFT JOIN routes r ON b.route_id = r.id
      ORDER BY b.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- SERVER ----------
const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
// ---------- ADMIN ROUTES ----------
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);