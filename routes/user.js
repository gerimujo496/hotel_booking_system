require("express-async-errors");
const express = require("express");
const { Booking } = require("../models/booking");
const authz = require("../middleware/authz");
const validateID = require("../middleware/validateID");
const validateParamsIDwithToken = require("../middleware/validateParamsIDwithToken");
const router = express.Router();

router.post(
  "/requestToBook/:userId",
  [validateID, validateParamsIDwithToken["userId"], authz["Client"]],
  async (req, res) => {
    //requestToBook/:userId?arrivalDate=YYYY-MM-DD&&departureDate=YYYY-MM-DD&&roomId=:roomId
    if (
      !req.query.arrivalDate ||
      !req.query.departureDate ||
      !req.query.roomId ||
      !req.params.userId
    )
      return res.status(400).send(`Invalid Request !`);

    const checkIfBookingExicts = await Booking.findOne({
      arrivalDate: { $gte: req.query.arrivalDate },
      departureDate: { $lt: req.query.departureDate },
      roomId: req.params.userId,
    });

    if (checkIfBookingExicts && checkIfBookingExicts.isApproved)
      return res.status(400).send(`The room is not avaible on those dates !`);

    const booking = new Booking({
      userId: req.params.userId,
      roomId: req.query.roomId,
      arrivalDate: req.query.arrivalDate,
      departureDate: req.query.departureDate,
    });

    const newBooking = await booking.save();
    res.status(201).send(newBooking);
  }
);

router.delete(
  "/requestToBook/:bookingId",
  [validateID, validateParamsIDwithToken["bookingId"], authz["Client"]],
  async (req, res) => {
    //requestToBook/:bookingId
    if (!req.params.bookingId) return res.status(400).send(`Invalid Request`);

    const checkIfBookingExicts = await Booking.findOne({
      _id: req.params.bookingId,
    });

    if (!checkIfBookingExicts)
      return res
        .status(400)
        .send(
          `The booking with the id: ${req.params.bookingId} does not exists  !`
        );

    const bookingDelete = await checkIfBookingExicts.deleteOne({
      _id: checkIfBookingExicts._id,
    });
    res.status(200).send(bookingDelete);
  }
);

router.get(
  "/requestToBook/:bookingId",
  [validateID, validateParamsIDwithToken["bookingId"], authz["Client"]],
  async (req, res) => {
    //requestToBook/:bookingId
    if (!req.params.bookingId) return res.status(400).send(`Invalid Request`);

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
    })
      .populate({ path: "userId", select: "firstName, lastName, email" })
      .populate({ path: "roomId", select: "type, number, description" });

    if (!booking)
      return res
        .status(400)
        .send(
          `The booking with the id: ${req.params.bookingId} does not exists  !`
        );
    booking;

    res.status(200).send(booking);
  }
);

router.put(
  "/requestToBook/:bookingId",
  [validateID, validateParamsIDwithToken["bookingId"], authz["Client"]],
  async (req, res) => {
    //requestToBook/:id?arrivalDate=YYYY-MM-DD&&departureDate=YYYY-MM-DD&&roomId=:id
    if (
      !req.query.arrivalDate ||
      !req.query.departureDate ||
      !req.query.roomId ||
      !req.params.bookingId
    )
      return res.status(400).send(`Invalid Request !`);

    const booking = await Booking.findOne({ _id: req.params.bookingId });

    if (!booking)
      return res
        .status(400)
        .send(
          `The booking with the id: ${req.params.bookingId} does not exists  !`
        );

    const RoomAvaible = await Booking.findOne({
      arrivalDate: { $gte: req.query.arrivalDate },
      departureDate: { $lt: req.query.departureDate },
      roomId: req.params.bookingId,
    });

    if (RoomAvaible && RoomAvaible.isApproved)
      return res.status(400).send(`The room is not avaible on those dates !`);

    const newBooking = await Booking.findOneAndUpdate(
      {
        arrivalDate: req.query.arrivalDate,
        departureDate: req.query.departureDate,
        roomId: req.query.roomId,
        _id: req.params.bookingId,
      },
      { new: true }
    );

    res.status(200).send(newBooking);
  }
);

router.get("/getCurrectClients", [authz["Manager"]], async (req, res) => {
  const currentClient = await Booking.find({
    arrivalDate: { $lte: Date.now() },
  }).populate({
    path: "userId",
    select: "firstName, lastName, email",
  });

  res.status(200).send(currentClient.userId);
});

router.get(
  "/getBookingHistory/:userId",
  [validateID, validateParamsIDwithToken["userId"], authz["Client"]],
  async (req, res) => {
    const bookings = await Booking.find({ userId: req.params.userId }).populate(
      {
        path: "roomId",
        select: "type, number, description",
      }
    );

    res.status(200).send(bookings);
  }
);

module.exports = router;
