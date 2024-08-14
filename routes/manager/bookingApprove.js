require("express-async-errors");
const express = require("express");
const { Booking } = require("../../models/booking");
const router = express.Router();

router.post("/:id", async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isApproved: true,
      },
    },
    { new: true }
  );
  await booking.save();

  const filter = {
    roomId: booking.roomId,
    arrivalDate: { $lt: booking.departureDate },
    departureDate: { $gt: booking.arrivalDate },
    isApproved: null,
  };

  const updateBooking = {
    $set: {
      isApproved: false,
    },
  };

  await Booking.updateMany(filter, updateBooking);
  res.send(booking);
});

module.exports = router;
