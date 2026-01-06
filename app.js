// app.js
const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: "https://bhs-more.netlify.app", // only your frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Routes
app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
