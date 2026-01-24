// routes/booking.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// ================= BOOKED SEATS =================
router.get("/:routeId/seats", bookingController.getBookedSeats);

// ================= BOOK SEATS =================
router.post("/:routeId", bookingController.bookSeats);

// ================= ADMIN VIEW =================
router.get("/", bookingController.getAllBookingsForAdmin);

// ================= GET BOOKING BY ID =================
router.get("/id/:id", bookingController.getBookingById);

// ================= DELETE =================
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
