require("express-async-errors");
const express = require("express");
const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const authz = require("../middleware/authz");
const validateID = require("../middleware/validateID");
const validateParamsIDwithToken = require("../middleware/validateParamsIDwithToken");
const path = require("path");
const isClient = require("../middleware/isClient");
const isManager = require("../middleware/isManager");

const router = express.Router();

router.post("/requestToBook/", isClient, async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { user } = req;

  if (!arrivalDate || !departureDate || !roomId || user._id)
    return res.status(400).send(`Invalid Request`);

  const existingBooking = await Booking.findOne({
    arrivalDate: { $gte: req.query.arrivalDate },
    departureDate: { $lt: req.query.departureDate },
    roomId: req.query.roomId,
  });

  const room = await Room.findOne({ _id: roomId });
  if (!room) res.status(400).send(`The room does not exists !`);

  if (existingBooking && existingBooking.isApproved)
    return res.status(400).send(`The room is not available on those dates !`);

  const booking = new Booking({
    userId: user._id,
    roomId: roomId,
    arrivalDate: arrivalDate,
    departureDate: departureDate,
  });

  const newBooking = await booking.save();
  res.status(201).send(newBooking);
});

router.delete("/requestToBook/:bookingId", isClient, async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).send(`Invalid Request`);

  const existingBooking = await Booking.findOne({
    _id: bookingId,
  });

  if (!existingBooking)
    return res
      .status(400)
      .send(`The booking with the id: ${bookingId} does not exists  !`);

  const bookingDelete = await Booking.deleteOne({
    _id: bookingId,
  });
  res.status(200).send(bookingDelete);
});

router.get("/requestToBook/:bookingId", isClient, async (req, res) => {
  const { bookingId } = req.params;
  if (bookingId) return res.status(400).send(`Invalid Request`);

  const booking = await Booking.findOne({
    _id: bookingId,
  })
    .populate({ path: "userId", select: "firstName, lastName, email" })
    .populate({ path: "roomId", select: "type, number, description" });

  if (!booking)
    return res
      .status(400)
      .send(`The booking with the id: ${bookingId} does not exists  !`);
  booking;

  res.status(200).send(booking);
});

router.put(
  "/requestToBook/:bookingId",
  isClient,
  async (req, res) => {

    const { arrivalDate, departureDate, roomId } = req.query;
    const { bookingId } = req;

    if (!arrivalDate || !departureDate || !roomId || !bookingId)
      return res.status(400).send(`Invalid Request`);

    const booking = await Booking.findOne({ _id: bookingId });

    if (!booking)
      return res
        .status(400)
        .send(
          `The booking with the id: ${bookingId} does not exists  !`
        );

    const availableRoom = await Booking.findOne({
      arrivalDate: { $gte: arrivalDate },
      departureDate: { $lt: departureDate },
      roomId: bookingId,
    });

    if (availableRoom && availableRoom.isApproved)
      return res.status(400).send(`The room is not available on those dates !`);

    const newBooking = await Booking.findOneAndUpdate(
      {
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        roomId: roomId,
        _id: bookingId,
      },
      { new: true }
    );

    res.status(200).send(newBooking);
  }
);

router.get("/getCurrentClient", isManager, async (req, res) => {

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
 isClient,
  async (req, res) => {

    const {userId} =  req.params;
    if(!userId) return res.status(400).send(`Invalid Request !`)

    const bookings = await Booking.find({
      userId: userId,
      arrivalDate: { $lte: Date.now() },
    }).populate({
      path: "roomId",
      select: "type, number, description",
    });

    res.status(200).send(bookings);
  }
);


