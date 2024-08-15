require("express-async-errors");
const express = require("express");
const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const isClient = require("../middleware/isClient");
const isManager = require("../middleware/isManager");
const PdfPrinter = require("pdfmake");
const generateVoucher = require("../helpers/generateVoucher");
const router = express.Router();

router.post("/requestToBook/", isClient, async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { user } = req;

  if (!arrivalDate || !departureDate || !roomId || !user._id)
    return res.status(400).send(`Invalid Request`);

  const room = await Room.findOne({ _id: roomId });
  if (!room) res.status(400).send(`The room does not exists !`);

  const overlappingDatesFilter = {
    arrivalDate: { $lt: departureDate },
    departureDate: { $gt: arrivalDate },
    roomId,
    isApproved: true,
  };
  const existingBooking = await Booking.findOne(overlappingDatesFilter);

  if (existingBooking)
    return res.status(400).send(`The room is not available on those dates !`);

  const bookingRequest = {
    userId: user._id,
    roomId,
    arrivalDate,
    departureDate,
  };
  const booking = new Booking(bookingRequest);

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

  const deletedBooking = await Booking.deleteOne(bookingBody);
  res.status(200).send(deletedBooking);
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
      .status(404)
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
    arrivalDate: { $lt: departureDate },
    departureDate: { $gt: arrivalDate },
    roomId,
    isApproved: true,
  };

  queryBody.newBookingBody = {
    arrivalDate,
    departureDate,
    roomId,
    isApproved: null,
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

  queryBody.currentClientBody = {
    arrivalDate: { $lt: new Date() },
    departureDate: { $gt: new Date() },
    isApproved: true,
  };

  queryBody.populateUserId = {
    path: "userId",
    select: "firstName, lastName, email",
  };
  console.log(queryBody.currentClientBody);

  const currentBooking = await Booking.find(
    queryBody.currentClientBody
  ).populate(queryBody.populateUserId);

  const currentClients = currentBooking.map((booking) => booking.userId);
  res.status(200).send(currentClients);
});

router.get("/getBookingHistory/", isClient, async (req, res) => {
  const { _id } = req.user;
  if (!_id) return res.status(400).send(`Invalid Request !`);

  const queryBody = {};

  queryBody.bookings = { userId: _id, arrivalDate: { $lte: new Date() } };
  queryBody.populateRoomId = {
    path: "roomId",
    select: "type numberOfBeds description",
  };

  const bookings = await Booking.find(queryBody.bookings).populate(
    queryBody.populateRoomId
  );

  res.status(200).send(bookings);
});

router.get("/getVoucher/:bookingId", isClient, async (req, res) => {
  try {
    const { user } = req;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId })
      .populate("userId", "firstName lastName email")
      .populate("roomId", "type number description numberOfBeds")
      .exec();

    if (!booking) {
      return res
        .status(404)
        .send(`The booking with the id ${bookingId} does not exists.`);
    }
    if (booking.userId._id != user._id)
      return res.status(401).send(`Unauthorized request.`);

    const pdfDoc = generateVoucher(booking);
    const chunks = [];

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=voucher.pdf");
      res.status(200).send(pdfBuffer);
    });

    pdfDoc.end();
  } catch (error) {
    console.error("Error generating voucher PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
