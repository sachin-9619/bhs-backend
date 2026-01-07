const app = require("./app");
const startBookingReminderCron = require("./bookingReminderCron");

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 listening");

  // ✅ start cron AFTER server is ready
  startBookingReminderCron();
});
