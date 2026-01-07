const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check (NO isReady)
app.get("/", (req, res) => {
  res.status(200).send("🚀 BHS Backend is LIVE");
});

// ✅ API ROUTES
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
