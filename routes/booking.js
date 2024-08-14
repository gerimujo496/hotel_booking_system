require("express-async-errors");
const express = require("express");
const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const isClient = require("../middleware/isClient");
const isManager = require("../middleware/isManager");
const router = express.Router();

router.post("/requestToBook/", isClient, async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { user } = req;

  if (!arrivalDate || !departureDate || !roomId || !user._id)
    return res.status(400).send(`Invalid Request`);

  const existingBookingBody = {
    arrivalDate: { $gte: arrivalDate },
    departureDate: { $lt: departureDate },
    roomId,
  };
  const existingBooking = await Booking.findOne(existingBookingBody);

  const room = await Room.findOne({ _id: roomId });
  if (!room) res.status(400).send(`The room does not exists !`);

  if (existingBooking && existingBooking.isApproved)
    return res.status(400).send(`The room is not available on those dates !`);

  const bookingBody = {
    userId: user._id,
    roomId,
    arrivalDate,
    departureDate,
  };
  const booking = new Booking(bookingBody);

  const newBooking = await booking.save();
  res.status(201).send(newBooking);
});

router.delete("/requestToBook/:bookingId", isClient, async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).send(`Invalid Request`);

  const bookingBody = {
    _id: bookingId,
  };
  const existingBooking = await Booking.findOne(bookingBody);

  if (!existingBooking)
    return res
      .status(400)
      .send(`The booking with the id: ${bookingId} does not exists  !`);

  const bookingDelete = await Booking.deleteOne(bookingBody);
  res.status(200).send(bookingDelete);
});

router.get("/requestToBook/:bookingId", isClient, async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).send(`Invalid Request`);

  const queryBody = {};

  queryBody.bookingBody = { _id: bookingId };

  queryBody.populateUserId = {
    path: "userId",
    select: "firstName lastName email",
  };

  queryBody.populateRoomId = {
    path: "roomId",
    select: "type number description",
  };

  const booking = await Booking.findOne(queryBody.bookingBody)
    .populate(queryBody.populateUserId)
    .populate(queryBody.populateRoomId);

  if (!booking)
    return res
      .status(400)
      .send(`The booking with the id: ${bookingId} does not exists  !`);
  booking;

  res.status(200).send(booking);
});

router.put("/requestToBook/:bookingId", isClient, async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { bookingId } = req.params;

  if (!arrivalDate || !departureDate || !roomId || !bookingId)
    return res.status(400).send(`Invalid Request !`);

  const queryBody = {};
  queryBody.bookingBody = { _id: bookingId };

  queryBody.availableRoomBody = {
    arrivalDate: { $gte: arrivalDate },
    departureDate: { $lt: departureDate },
    roomId: bookingId,
  };

  queryBody.newBookingBody = {
    arrivalDate,
    departureDate,
    roomId,
  };
  const booking = await Booking.findOne(queryBody.bookingBody);

  if (!booking)
    return res
      .status(400)
      .send(`The booking with the id: ${bookingId} does not exists  !`);

  const availableRoom = await Booking.findOne(queryBody.availableRoomBody);

  if (availableRoom && availableRoom.isApproved)
    return res.status(400).send(`The room is not available on those dates !`);

  const newBooking = await Booking.findOneAndUpdate(
    queryBody.bookingBody,
    queryBody.newBookingBody,
    { new: true }
  );

  res.status(200).send(newBooking);
});

router.get("/getCurrentClient", isManager, async (req, res) => {
  const queryBody = {};

  queryBody.queryBody.currentClientBody = {
    arrivalDate: { $lte: Date.now() },
  };

  queryBody.populateUserId = {
    path: "userId",
    select: "firstName, lastName, email",
  };

  const currentClient = await Booking.find(
    queryBody.currentClientBody
  ).populate(queryBody.populateUserId);

  res.status(200).send(currentClient.userId);
});

router.get("/getBookingHistory/:userId", isClient, async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).send(`Invalid Request !`);

  const queryBody = {};

  queryBody.bookings = { userId, arrivalDate: { $lte: Date.now() } };
  queryBody.populateRoomId = {
    path: "roomId",
    select: "type numberOfBeds description",
  };

  const bookings = await Booking.find(queryBody.bookings).populate(
    queryBody.populateRoomId
  );

  res.status(200).send(bookings);
});

module.exports = router;
