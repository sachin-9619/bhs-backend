const db = require("../db");

const fixTime = (t) => (t && t.length === 5 ? `${t}:00` : t);

exports.getAllRoutesForAdmin = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, bus_name, departure, destination, available_seats, price
       FROM routes ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch routes error:", err);
    res.status(500).json({ message: "Failed to fetch routes" });
  } finally {
    conn.release();
  }
};


// ADD ROUTE
exports.addRoute = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const {
      busName,
      busType,
      departure,
      destination,
      departureTime,
      arrivalTime,
      availableSeats,
      price,
      stops,
    } = req.body;

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO routes
       (bus_name, bus_type, departure, destination,
        departure_time, arrival_time, available_seats, price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        busName,
        busType || "ac",
        departure,
        destination,
        fixTime(departureTime),
        fixTime(arrivalTime),
        availableSeats ?? 40,
        price ?? 0,
      ]
    );

    const routeId = result.insertId;

    if (stops) {
      const cities = stops.split(",");
      for (const city of cities) {
        await conn.execute(
          "INSERT INTO route_points (route_id, city) VALUES (?, ?)",
          [routeId, city.trim()]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, routeId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to add route" });
  } finally {
    conn.release();
  }
};

// UPDATE ROUTE
exports.updateRoute = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;
    const {
      busName,
      busType,
      departure,
      destination,
      departureTime,
      arrivalTime,
      availableSeats,
      price,
    } = req.body;

    await conn.beginTransaction();

    await conn.execute(
      `UPDATE routes SET
        bus_name=?, bus_type=?, departure=?, destination=?,
        departure_time=?, arrival_time=?, available_seats=?, price=?
       WHERE id=?`,
      [
        busName,
        busType,
        departure,
        destination,
        fixTime(departureTime),
        fixTime(arrivalTime),
        availableSeats,
        price,
        id,
      ]
    );

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to update route" });
  } finally {
    conn.release();
  }
};

// DELETE ROUTE
exports.deleteRoute = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;

    await conn.beginTransaction();
    await conn.execute("DELETE FROM route_points WHERE route_id=?", [id]);
    await conn.execute("DELETE FROM routes WHERE id=?", [id]);
    await conn.commit();

    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to delete route" });
  } finally {
    conn.release();
  }
};
