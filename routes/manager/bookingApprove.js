require("express-async-errors");
const express = require("express");
const isManager = require("../../middleware/isManager");
const { Booking } = require("../../models/booking");
const router = express.Router();

router.post("/:id", isManager, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id });

    if (!booking) {
      return res.status(404).send("Booking request not found.");
    }

    const approvedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isApproved: true,
        },
      },
      { new: true }
    );

    const filter = {
      roomId: approvedBooking.roomId,
      arrivalDate: { $lt: approvedBooking.departureDate },
      departureDate: { $gt: approvedBooking.arrivalDate },
      isApproved: null,
    };

    const updateBooking = {
      $set: {
        isApproved: false,
      },
    };

    await Booking.updateMany(filter, updateBooking);
    res.send(approvedBooking);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
