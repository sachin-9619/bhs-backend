const cron = require("node-cron");
const db = require("../db");
const { sendBookingMail } = require("./mailer");

function startBookingReminderCron() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const [rows] = await db.execute(`
        SELECT 
          b.id,
          b.user_name,
          b.phone,
          b.travel_date,
          b.amount,
          b.email,
          r.busName,
          r.departure,
          r.destination,
          r.departureTime,
          TIMESTAMP(CONCAT(b.travel_date, ' ', r.departureTime)) AS departureDateTime
        FROM bookings b
        JOIN routes r ON b.route_id = r.id
        WHERE b.status = 'CONFIRMED'
      `);

      const now = new Date();

      for (const booking of rows) {
        if (!booking.email) continue;

        const departureTime = new Date(booking.departureDateTime);
        const diffMinutes = (departureTime - now) / (1000 * 60);

        if (diffMinutes >= 55 && diffMinutes <= 65) {
          await sendBookingMail(booking.email, booking, "REMINDER");
          console.log("⏰ Reminder sent to:", booking.email);
        }
      }
    } catch (err) {
      console.error("Reminder cron failed ❌", err);
    }
  });

  console.log("⏰ Booking reminder cron started");
}

module.exports = startBookingReminderCron;
