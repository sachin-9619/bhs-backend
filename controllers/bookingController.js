// controllers/bookingController.js
const { pool } = require("../db");
const { sendBookingMail } = require("../mailer");

// ================= GET BOOKED SEATS =================
exports.getBookedSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "Date required" });

    const [rows] = await pool.execute(
      "SELECT seat_number FROM bookings WHERE route_id=? AND travel_date=?",
      [routeId, date]
    );

    res.json(rows.map(r => Number(r.seat_number)));
  } catch (err) {
    console.error("❌ getBookedSeats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= BOOK SEATS =================
exports.bookSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { seats, userName, phone, travelDate, amount, email } = req.body;

    if (!seats?.length || !travelDate || !email || !userName || !phone) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // Check already booked seats
    const placeholders = seats.map(() => "?").join(",");
    const [existing] = await pool.execute(
      `SELECT seat_number FROM bookings
       WHERE route_id=? AND travel_date=? AND seat_number IN (${placeholders})`,
      [routeId, travelDate, ...seats]
    );

    if (existing.length) {
      return res.status(400).json({
        message: "Seats already booked",
        bookedSeats: existing.map(e => Number(e.seat_number)),
      });
    }

    // Insert bookings
    for (const seat of seats) {
      await pool.execute(
        `INSERT INTO bookings
         (route_id, seat_number, user_name, phone, amount, travel_date, status, email)
         VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)`,
        [routeId, seat, userName, phone, amount, travelDate, email]
      );
    }

    // Get route info
    const [[route]] = await pool.execute(
      `SELECT bus_name AS busName, departure, destination,
              departure_time AS departureTime
       FROM routes WHERE id=?`,
      [routeId]
    );

    const bookingData = {
      userName,
      email,
      phone,
      busName: route?.busName || "",
      departure: route?.departure || "",
      destination: route?.destination || "",
      departureTime: route?.departureTime || "",
      seats: seats.join(", "),
      amount,
    };

    // Send emails (non-blocking)
    try {
      await sendBookingMail(email, bookingData, "CONFIRMATION");
      if (process.env.ADMIN_EMAIL) {
        await sendBookingMail(process.env.ADMIN_EMAIL, bookingData, "ADMIN_NOTIFICATION");
      }
    } catch (mailErr) {
      console.warn("⚠️ Mail failed but booking confirmed");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ bookSeats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET BOOKING BY ID =================
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM bookings WHERE id=?",
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "Booking not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ getBookingById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN VIEW =================
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.id, b.user_name, b.seat_number AS seats, b.amount,
              DATE_FORMAT(b.travel_date,'%d-%m-%Y') AS date,
              CONCAT(r.departure,' → ',r.destination) AS route
       FROM bookings b
       JOIN routes r ON b.route_id = r.id
       ORDER BY b.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ getAllBookingsForAdmin:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ================= DELETE =================
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM bookings WHERE id=?",
      [id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: "Booking not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteBooking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  sendBookingMail
};
