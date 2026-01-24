const { pool } = require("../db");

// Helper to fix time format
const fixTime = (t) => (t && t.length === 5 ? `${t}:00` : t);

/* ================= GET ALL ROUTES ================= */
exports.getAllRoutesForAdmin = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, bus_name, bus_type, departure, destination,
             departure_time, arrival_time, available_seats, price
      FROM routes
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch routes error:", err);
    res.status(500).json({ message: "Failed to fetch routes" });
  }
};

/* ================= ADD ROUTE ================= */
exports.addRoute = async (req, res) => {
  const client = await pool.connect();
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

    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO routes
      (bus_name, bus_type, departure, destination,
       departure_time, arrival_time, available_seats, price)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
      `,
      [
        busName,
        busType || "AC",
        departure,
        destination,
        fixTime(departureTime),
        fixTime(arrivalTime),
        availableSeats ?? 40,
        price ?? 0,
      ]
    );

    const routeId = result.rows[0].id;

    if (stops) {
      const cities = stops.split(",");
      for (const city of cities) {
        await client.query(
          "INSERT INTO route_points (route_id, city) VALUES ($1,$2)",
          [routeId, city.trim()]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({ success: true, routeId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add route error:", err);
    res.status(500).json({ message: "Failed to add route" });
  } finally {
    client.release();
  }
};

/* ================= UPDATE ROUTE ================= */
exports.updateRoute = async (req, res) => {
  const client = await pool.connect();
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

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE routes SET
        bus_name=$1,
        bus_type=$2,
        departure=$3,
        destination=$4,
        departure_time=$5,
        arrival_time=$6,
        available_seats=$7,
        price=$8
      WHERE id=$9
      `,
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

    if (stops) {
      await client.query("DELETE FROM route_points WHERE route_id=$1", [id]);

      const cities = stops.split(",");
      for (const city of cities) {
        await client.query(
          "INSERT INTO route_points (route_id, city) VALUES ($1,$2)",
          [id, city.trim()]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update route error:", err);
    res.status(500).json({ message: "Failed to update route" });
  } finally {
    client.release();
  }
};

/* ================= DELETE ROUTE ================= */
exports.deleteRoute = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");
    await client.query("DELETE FROM route_points WHERE route_id=$1", [id]);
    await client.query("DELETE FROM routes WHERE id=$1", [id]);
    await client.query("COMMIT");

    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete route error:", err);
    res.status(500).json({ message: "Failed to delete route" });
  } finally {
    client.release();
  }
};
