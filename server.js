const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./db"); // ✅ only initialize DB

const routeRoutes = require("./routes/routes");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

const app = express();

app.use(cors({
  origin: [
    "https://bhs-more.netlify.app",
    "https://bhs-more45.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/routes", routeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
