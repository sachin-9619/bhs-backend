// controllers/routeController.js
const { pool } = require("../db");

// Helper to fix time format
const fixTime = (t) => (t && t.length === 5 ? `${t}:00` : t);

// ================= GET ALL ROUTES (ADMIN) =================
exports.getAllRoutesForAdmin = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, bus_name, bus_type, departure, destination, departure_time, arrival_time, available_seats, price
       FROM routes ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch routes error:", err);
    res.status(500).json({ message: "Failed to fetch routes" });
  }
};

// ================= ADD ROUTE =================
exports.addRoute = async (req, res) => {
  const conn = await pool.getConnection();
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
        (bus_name, bus_type, departure, destination, departure_time, arrival_time, available_seats, price)
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

    // Insert route points if provided
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
    console.error("Add route error:", err);
    res.status(500).json({ message: "Failed to add route" });
  } finally {
    conn.release();
  }
};

// ================= UPDATE ROUTE =================
exports.updateRoute = async (req, res) => {
  const conn = await pool.getConnection();
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
      stops,
    } = req.body;

    await conn.beginTransaction();

    // Update main route
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

    // Update route points if provided
    if (stops) {
      // Delete existing points
      await conn.execute("DELETE FROM route_points WHERE route_id=?", [id]);

      const cities = stops.split(",");
      for (const city of cities) {
        await conn.execute(
          "INSERT INTO route_points (route_id, city) VALUES (?, ?)",
          [id, city.trim()]
        );
      }
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("Update route error:", err);
    res.status(500).json({ message: "Failed to update route" });
  } finally {
    conn.release();
  }
};

// ================= DELETE ROUTE =================
exports.deleteRoute = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    await conn.beginTransaction();

    // Delete route points first (FK CASCADE ensures safety)
    await conn.execute("DELETE FROM route_points WHERE route_id=?", [id]);

    // Delete route
    await conn.execute("DELETE FROM routes WHERE id=?", [id]);

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("Delete route error:", err);
    res.status(500).json({ message: "Failed to delete route" });
  } finally {
    conn.release();
  }
};
