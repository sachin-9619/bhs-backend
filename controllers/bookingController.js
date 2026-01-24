const { pool } = require("../db");
const { sendBookingMail } = require("../mailer");

// ================= DATE NORMALIZER =================
function normalizeDate(dateStr) {
  // MM/DD/YYYY -> YYYY-MM-DD
  if (dateStr.includes("/")) {
    const [mm, dd, yyyy] = dateStr.split("/");
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return dateStr;
}

// ================= GET BOOKED SEATS =================
exports.getBookedSeats = async (req, res) => {
  try {
    const { routeId } = req.params;
    let { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const travelDate = normalizeDate(date);

    const result = await pool.query(
      `
      SELECT seat_number
      FROM bookings
      WHERE route_id = $1
        AND travel_date = $2
        AND status = 'CONFIRMED'
      `,
      [routeId, travelDate]
    );

    res.json({
      seats: result.rows.map(r => Number(r.seat_number))
    });

  } catch (err) {
    console.error("❌ getBookedSeats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= BOOK SEATS =================
exports.bookSeats = async (req, res) => {
  const client = await pool.connect();

  try {
    const { routeId } = req.params;
    let { seats, userName, phone, travelDate, amount, email } = req.body;

    if (!seats?.length || !travelDate || !email || !userName || !phone) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    travelDate = normalizeDate(travelDate);

    await client.query("BEGIN");

    // 🔒 Check already booked seats
    const check = await client.query(
      `
      SELECT seat_number
      FROM bookings
      WHERE route_id = $1
        AND travel_date = $2
        AND seat_number = ANY($3)
      `,
      [routeId, travelDate, seats]
    );

    if (check.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Seats already booked",
        bookedSeats: check.rows.map(r => Number(r.seat_number))
      });
    }

    // ✅ Insert bookings
    for (const seat of seats) {
      await client.query(
        `
        INSERT INTO bookings
        (route_id, seat_number, user_name, phone, amount, travel_date, status, email)
        VALUES ($1,$2,$3,$4,$5,$6,'CONFIRMED',$7)
        `,
        [routeId, seat, userName, phone, amount, travelDate, email]
      );
    }

    // 🚌 Route info
    const routeRes = await client.query(
      `
      SELECT bus_name AS "busName",
             departure,
             destination,
             departure_time AS "departureTime"
      FROM routes
      WHERE id = $1
      `,
      [routeId]
    );

    const route = routeRes.rows[0] || {};

    const bookingData = {
      userName,
      email,
      phone,
      busName: route.busName || "",
      departure: route.departure || "",
      destination: route.destination || "",
      departureTime: route.departureTime || "",
      seats: seats.join(", "),
      amount,
      travelDate
    };

    await client.query("COMMIT");

    // 📧 Emails (non-blocking)
    try {
      await sendBookingMail(email, bookingData, "CONFIRMATION");
      if (process.env.ADMIN_EMAIL) {
        await sendBookingMail(
          process.env.ADMIN_EMAIL,
          bookingData,
          "ADMIN_NOTIFICATION"
        );
      }
    } catch {
      console.warn("⚠️ Mail failed but booking confirmed");
    }

    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ bookSeats:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// ================= GET BOOKING BY ID =================
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("❌ getBookingById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN VIEW =================
exports.getAllBookingsForAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        b.id,
        b.user_name,
        b.seat_number AS seats,
        b.amount,
        TO_CHAR(b.travel_date,'DD-MM-YYYY') AS date,
        r.departure || ' → ' || r.destination AS route
      FROM bookings b
      JOIN routes r ON b.route_id = r.id
      ORDER BY b.created_at DESC
      `
    );

    res.json(result.rows);

  } catch (err) {
    console.error("❌ getAllBookingsForAdmin:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ================= DELETE =================
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM bookings WHERE id = $1",
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("❌ deleteBooking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
