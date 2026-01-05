const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
