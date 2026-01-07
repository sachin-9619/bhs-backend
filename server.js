const app = require("./app");

// side effects AFTER load
require("./db");
require("./bookingReminderCron");

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 listening");
});
