const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/routes", require("./routes/routes"));
app.use("/api/booking", require("./routes/booking"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));

// ================= ADMIN LOGIN =================
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

// ================= SERVER =================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
