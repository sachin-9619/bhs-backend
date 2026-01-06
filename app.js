// app.js
const express = require("express");
const cors = require("cors");

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

const app = express();

/* ===========================
   ✅ CORS CONFIG (FINAL)
=========================== */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bhs-more45.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ VERY IMPORTANT (preflight fix)
app.options("*", cors());

/* ===========================
   MIDDLEWARES
=========================== */
app.use(express.json());

/* ===========================
   ROUTES
=========================== */
app.use("/routes", routeRoutes);
app.use("/booking", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", (req, res) => {
  res.send("BHS Backend Running ✅");
});

module.exports = app;
