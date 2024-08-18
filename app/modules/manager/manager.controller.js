require("express-async-errors");

const errors = require("../../constants/errors");
const { Booking } = require("../../models/booking");

const approveBooking = async (req, res) => {
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
    res.status(500).send(errors.ERROR_STATUS_500("approving", "booking"));
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({});

    if (bookings.length === 0) {
      return res.send("There are no bookings in the history");
    }

    res.send(bookings);
  } catch (error) {
    res.status(500).send(errors.ERROR_STATUS_500("getting", "booking history"));
  }
};
const exportObj = { approveBooking, getBookingHistory };
module.exports = exportObj