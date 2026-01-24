const db = require("../db");

/* =========================
   ALL BOOKINGS (ADMIN)
========================= */
exports.getAllBookings = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM bookings ORDER BY created_at DESC`
  );
  return rows;
};

/* =========================
   GET BOOKED SEATS (DATE)
========================= */
exports.getBookedSeats = async (routeId, travelDate) => {
  const [rows] = await db.execute(
    `SELECT seat_number 
     FROM bookings 
     WHERE route_id=? AND travel_date=?`,
    [routeId, travelDate]
  );
  return rows;
};

/* =========================
   CHECK EXISTING SEATS
========================= */
exports.checkExistingSeats = async (routeId, seats, travelDate) => {
  const placeholders = seats.map(() => "?").join(",");

  const [rows] = await db.execute(
    `SELECT seat_number FROM bookings
     WHERE route_id=?
     AND travel_date=?
     AND seat_number IN (${placeholders})`,
    [routeId, travelDate, ...seats]
  );

  return rows;
};

/* =========================
   BOOK SEATS
========================= */
exports.bookSeats = async (
  routeId,
  seats,
  userName,
  phone,
  amount,
  travelDate
) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (const seat of seats) {
      await conn.execute(
        `INSERT INTO bookings
         (route_id, travel_date, seat_number, user_name, phone, amount, status)
         VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
        [routeId, travelDate, seat, userName, phone, amount]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
