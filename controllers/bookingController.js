const db = require("../models/db");
const { sendBookingMail } = require("../mailer");

// ================= GET BOOKED SEATS =================
exports.getBookedSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { date } = req.query;

    const [rows] = await db.execute(
      "SELECT seat_number FROM bookings WHERE route_id=? AND travel_date=?",
      [routeId, date]
    );

    res.json(rows.map(r => Number(r.seat_number)));
  } catch (err) {
    console.error("❌ getBookedSeats error:", err);
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

    /* ---------- CHECK ALREADY BOOKED SEATS ---------- */
    const placeholders = seats.map(() => "?").join(",");
    const [existing] = await db.execute(
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

    /* ---------- INSERT BOOKINGS ---------- */
    for (let seat of seats) {
      await db.execute(
        `INSERT INTO bookings
         (route_id, seat_number, user_name, phone, amount, travel_date, status, email)
         VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)`,
        [routeId, seat, userName, phone, amount, travelDate, email]
      );
    }

    /* ---------- FETCH ROUTE INFO ---------- */
    const [routeRows] = await db.execute(
      "SELECT bus_name AS busName, departure, destination, departure_time AS departureTime FROM routes WHERE id=?",
      [routeId]
    );

    const routeInfo = routeRows[0];

    const bookingData = {
      userName,
      email,
      phone,
      busName: routeInfo.busName,
      departure: routeInfo.departure,
      destination: routeInfo.destination,
      departureTime: routeInfo.departureTime,
      seats: seats.join(", "),
      amount,
    };

    /* ---------- SEND MAILS ---------- */
    try {
      // Send confirmation to user
      await sendBookingMail(email, bookingData, "CONFIRMATION");

      // Send notification to admin
      if (process.env.ADMIN_EMAIL) {
        await sendBookingMail(process.env.ADMIN_EMAIL, bookingData, "ADMIN_NOTIFICATION");
      }
    } catch (mailErr) {
      console.error("⚠️ Mail failed but booking saved:", mailErr);
    }

    /* ---------- FINAL RESPONSE ---------- */
    res.json({ success: true });

  } catch (err) {
    console.error("❌ bookSeats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN =================
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT b.id, b.user_name, b.seat_number AS seats, b.amount,
              DATE_FORMAT(b.travel_date, '%d-%m-%Y') AS date,
              CONCAT(r.departure, ' → ', r.destination) AS route
       FROM bookings b
       JOIN routes r ON b.route_id = r.id
       ORDER BY b.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ getAllBookingsForAdmin error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ================= DELETE BOOKING =================
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM bookings WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
