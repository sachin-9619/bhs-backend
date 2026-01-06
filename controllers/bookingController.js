const db = require("../db");

/**
 * GET booked seats by route + date
 * URL: /api/booking/:routeId/seats?date=YYYY-MM-DD
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
      "SELECT seat_number FROM bookings WHERE route_id = ? AND journey_date = ?",
      [routeId, date]
    );

    const bookedSeats = rows.map(r => r.seat_number);

    res.json({
      routeId,
      date,
      bookedSeats
    });

  } catch (error) {
    console.error("getBookedSeats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * POST book seats
 * URL: /api/booking/:routeId
 */
exports.bookSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { seats, date, userId } = req.body;

    if (!routeId || !seats || !date) {
      return res.status(400).json({ message: "Missing data" });
    }

    for (let seat of seats) {
      await db.query(
        "INSERT INTO bookings(route_id, seat_number, journey_date, user_id) VALUES (?, ?, ?, ?)",
        [routeId, seat, date, userId || null]
      );
    }

    res.json({ message: "Seats booked successfully" });

  } catch (error) {
    console.error("bookSeats error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
};


/**
 * Admin: get all bookings
 */
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


/**
 * Delete booking
 */
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM bookings WHERE id = ?", [id]);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
