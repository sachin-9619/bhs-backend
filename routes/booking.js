// routes/booking.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// ================= BOOKED SEATS =================
router.get("/:routeId/seats", bookingController.getBookedSeats);

// ================= BOOK SEATS =================
router.post("/:routeId", bookingController.bookSeats);

// ================= GET BOOKING BY ID =================
router.get("/:id", bookingController.getBookingById);

// ================= ADMIN VIEW =================
router.get("/", bookingController.getAllBookingsForAdmin);

// ================= DELETE =================
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
