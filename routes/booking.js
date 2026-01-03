const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// seats
router.get("/:routeId/seats", bookingController.getBookedSeats);

// booking
router.post("/:routeId", bookingController.bookSeats);

// admin view
router.get("/", bookingController.getAllBookingsForAdmin);

// delete booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
