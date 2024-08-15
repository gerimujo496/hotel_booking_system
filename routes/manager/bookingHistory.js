require("express-async-errors");
const express = require("express");
const isManager = require("../../middleware/isManager");
const { Booking } = require("../../models/booking");
const router = express.Router();

router.get("/", isManager, async (req, res) => {
  const bookings = await Booking.find({});

  if (bookings.length === 0) {
    return res.send("There are no bookings in the history");
  }

  res.send(bookings);
});

module.exports = router;
