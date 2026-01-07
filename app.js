const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

const app = express();
app.get("/", (req, res) => {
  if (!isReady) return res.status(503).send("⏳ Starting...");
  res.status(200).send("🚀 BHS Backend is LIVE");
});
app.use(cors());
app.use(express.json());

// ✅ API ROUTES
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
