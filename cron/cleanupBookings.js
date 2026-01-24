const cron = require("node-cron");
const { pool } = require("../db");

// ⏰ Every 10 minutes (safe + accurate)
cron.schedule("*/10 * * * *", async () => {
  try {
    const result = await pool.query(`
      DELETE FROM bookings
      WHERE
        (travel_date + departure_time + INTERVAL '1 hour') < NOW()
    `);

    if (result.rowCount > 0) {
      console.log(
        `🧹 Auto-deleted ${result.rowCount} completed trips (1hr after end)`
      );
    }
  } catch (err) {
    console.error("❌ Cleanup cron failed:", err);
  }
});
