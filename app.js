const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

module.exports = app;



// const routeRoutes = require("./routes/routes");
// const bookingRoutes = require("./routes/booking");
// const adminRoutes = require("./routes/admin");
// const contactRoutes = require("./routes/contact");

// const app = express();

// /* ===========================
//    HEALTH CHECK
// =========================== */
// app.get("/", (req, res) => {
//   res.send("BHS Backend Running ✅");
// });

// /* ===========================
//    ✅ CORS CONFIG (FINAL)
// =========================== */
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://bhs-more45.netlify.app"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// /* ===========================
//    MIDDLEWARES
// =========================== */
// app.use(express.json());

// /* ===========================
//    ROUTES
// =========================== */
// app.use("/api/routes", routeRoutes);
// app.use("/api/booking", bookingRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/contact", contactRoutes);


// module.exports = app;
