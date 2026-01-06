const db = require("../models/db");

/**
 * GET booked seats
 * /api/booking/:routeId/seats?date=YYYY-MM-DD
 */
exports.getBookedSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { date } = req.query;

    if (!routeId || !date) {
      return res.status(400).json({
        message: "routeId and date are required"
      });
    }

    const [rows] = await db.query(
      "SELECT seat_number FROM bookings WHERE route_id=? AND journey_date=?",
      [routeId, date]
    );

    res.json(rows.map(r => Number(r.seat_number)));
  } catch (err) {
    console.error("❌ getBookedSeats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * BOOK seats
 * /api/booking/:routeId
 */
exports.bookSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { seats, date, userName, phone, email, amount } = req.body;

    if (!seats?.length || !date || !userName || !phone) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // check already booked seats
    const placeholders = seats.map(() => "?").join(",");
    const [existing] = await db.query(
      `SELECT seat_number FROM bookings 
       WHERE route_id=? AND journey_date=? AND seat_number IN (${placeholders})`,
      [routeId, date, ...seats]
    );

    if (existing.length) {
      return res.status(400).json({
        message: "Seats already booked",
        bookedSeats: existing.map(e => Number(e.seat_number))
      });
    }

    // insert seats
    for (let seat of seats) {
      await db.query(
        `INSERT INTO bookings
        (route_id, seat_number, journey_date, user_name, phone, email, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
        [routeId, seat, date, userName, phone, email || null, amount || 0]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ bookSeats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN – get all bookings
 */
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ getAllBookingsForAdmin:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/**
 * DELETE booking
 */
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM bookings WHERE id=?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteBooking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
