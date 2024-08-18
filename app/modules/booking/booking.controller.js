const mongoose = require("mongoose");
const errors = require("../../constants/errors");
const { Booking } = require("../../models/booking");
const { Room } = require("../../models/room");
const generateVoucher = require("../../helpers/generateVoucher");

const makeBooking = async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { user } = req;

  if (!arrivalDate || !departureDate || !roomId || !user._id)
    return res.status(400).send(errors.MISSING_PARAMETER);

  const room = await Room.findOne({ _id: roomId });
  if (!room) res.status(400).send(() => errors.NOT_FOUND("room", roomId));

  const overlappingDatesFilter = {
    arrivalDate: { $lt: departureDate },
    departureDate: { $gt: arrivalDate },
    roomId,
    isApproved: true,
  };
  const existingBooking = await Booking.findOne(overlappingDatesFilter);

  if (existingBooking)
    return res.status(409).send(errors.ROOMS_NOT_AVAILABLE_ON_THOSE_DATES);

  const bookingRequest = {
    userId: user._id,
    roomId,
    arrivalDate,
    departureDate,
  };
  const booking = new Booking(bookingRequest);

  const newBooking = await booking.save();
  res.status(201).send(newBooking);
};

const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).send(errors.MISSING_PARAMETER);

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).send(errors.INVALID_ID);
  }

  const bookingBody = {
    _id: bookingId,
  };
  const existingBooking = await Booking.findOne(bookingBody);

  if (!existingBooking)
    return res.status(404).send(() => errors.NOT_FOUND("booking", bookingId));

  const deletedBooking = await Booking.findOneAndDelete(bookingBody);
  res.status(200).send(deletedBooking);
};

const getBooking = async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).send(errors.MISSING_PARAMETER);

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).send(errors.INVALID_ID);
  }

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
    return res.status(404).send(() => errors.NOT_FOUND("booking", booking));
  booking;

  res.status(200).send(booking);
};

const updateBooking = async (req, res) => {
  const { arrivalDate, departureDate, roomId } = req.query;
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).send(errors.INVALID_ID);
  }

  if (!arrivalDate || !departureDate || !roomId || !bookingId)
    return res.status(400).send(() => errors.MISSING_PARAMETER);

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
    return res.status(400).send(() => errors.NOT_FOUND("booking", bookingId));

  const availableRoom = await Booking.findOne(queryBody.availableRoomBody);

  if (availableRoom && availableRoom.isApproved)
    return res.status(400).send(errors.ROOMS_NOT_AVAILABLE_ON_THOSE_DATES);

  const newBooking = await Booking.findOneAndUpdate(
    queryBody.bookingBody,
    queryBody.newBookingBody,
    { new: true }
  );

  res.status(200).send(newBooking);
};

const getCurrentClient = async (req, res) => {
  const queryBody = {};

  queryBody.currentClientBody = {
    arrivalDate: { $lt: new Date() },
    departureDate: { $gt: new Date() },
    isApproved: true,
  };

  queryBody.populateUserId = {
    path: "userId",
    select: "firstName lastName email",
  };

  const currentBooking = await Booking.find(
    queryBody.currentClientBody
  ).populate(queryBody.populateUserId);

  const currentClients = currentBooking.map((booking) => booking.userId);
  res.status(200).send(currentClients);
};

const getBookingHistory = async (req, res) => {
  const { _id } = req.user;
  if (!_id) return res.status(400).send(errors.MISSING_PARAMETER);

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
};

const getVoucher = async (req, res) => {
  try {
    const { user } = req;
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).send(errors.INVALID_ID);
    }

    const booking = await Booking.findOne({ _id: bookingId })
      .populate("userId", "firstName lastName email")
      .populate("roomId", "type number description numberOfBeds")
      .exec();

    if (!booking) {
      return res.status(404).send(() => errors.NOT_FOUND("booking", bookingId));
    }

    if (booking.userId._id != user._id)
      return res.status(403).send(errors.FORBIDDEN);

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
    res.status(500).send("Internal Server Error");
  }
};

const exportObj = {
  makeBooking,
  deleteBooking,
  getBooking,
  updateBooking,
  getCurrentClient,
  getBookingHistory,
  getVoucher,
};

module.exports = exportObj;
