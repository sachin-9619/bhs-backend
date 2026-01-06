// routes/booking.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// GET booked seats
// /api/booking/:routeId/seats?date=YYYY-MM-DD
router.get("/:routeId/seats", bookingController.getBookedSeats);

// BOOK seats
// /api/booking/:routeId
router.post("/:routeId", bookingController.bookSeats);

// ADMIN – all bookings
router.get("/", bookingController.getAllBookingsForAdmin);

// DELETE booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
