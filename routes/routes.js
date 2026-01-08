// routes/booking.js
const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

// ================= BOOKED SEATS =================
router.get("/:routeId/seats", routeController.getBookedSeats);

// ================= BOOK SEATS =================
router.post("/:routeId", routeController.bookSeats);

// ================= GET BOOKING BY ID =================
router.get("/:id", routeController.getBookingById);

// ================= ADMIN VIEW =================
router.get("/", routeController.getAllBookingsForAdmin);

// ================= DELETE =================
router.delete("/:id", routeController.deleteBooking);

module.exports = router;
