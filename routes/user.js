const express = require("express");
const router = express.Router();
require("express-async-errors");
const { Booking } = require("../models/booking");

router.post("/requestToBook/:id", async (req, res) => {
  //requestToBook/:id?arrivalDate=YYYY-MM-DD&&departureDate=YYYY-MM-DD&&roomId=:id
  if (
    !req.query.arrivalDate ||
    !req.query.departureDate ||
    !req.query.roomId ||
    !req.params.id
  )
    return res.status(400).send(`Invalid Request !`);
  const checkIfBookingExicts = await Booking.findOne({
    arrivalDate: { $gte: req.query.arrivalDate },
    departureDate: { $lt: req.query.departureDate },
    roomId: req.params.id,
  });

  if (checkIfBookingExicts && checkIfBookingExicts.isApproved)
    return res.status(400).send(`The room is not avaible on those dates !`);

  const booking = new Booking({
    userId: req.params.id,
    roomId: req.query.roomId,
    arrivalDate: req.query.arrivalDate,
    departureDate: req.query.departureDate,
  });

  const newBooking = await booking.save();
  res.status(201).send(newBooking);
});

router.delete("/requestToBook/:id", async (req, res) => {
  //requestToBook/:id
  if (!req.params.id) return res.status(400).send(`Invalid Request`);

  const checkIfBookingExicts = await Booking.findOne({
    _id: req.params.id,
  });

  if (!checkIfBookingExicts)
    return res
      .status(400)
      .send(`The booking with the id: ${req.params.id} does not exists  !`);

  const bookingDelete = await checkIfBookingExicts.deleteOne({
    _id: checkIfBookingExicts._id,
  });
  res.status(200).send(bookingDelete);
});

router.get("/requestToBook/:id", async (req, res) => {
  //requestToBook/:id
  if (!req.params.id) return res.status(400).send(`Invalid Request`);

  const booking = await Booking.findOne({
    _id: req.params.id,
  })
    .populate("User")
    .populate("Room");

  if (!booking)
    return res
      .status(400)
      .send(`The booking with the id: ${req.params.id} does not exists  !`);
  booking;

  res.status(200).send(booking);
});

router.put("/requestToBook/:id", async (req, res) => {
  //requestToBook/:id?arrivalDate=YYYY-MM-DD&&departureDate=YYYY-MM-DD&&roomId=:id
  if (
    !req.query.arrivalDate ||
    !req.query.departureDate ||
    !req.query.roomId ||
    !req.params.id
  )
    return res.status(400).send(`Invalid Request !`);

  const booking = await Booking.findOne({ _id: req.params.id });

  if (!booking)
    return res
      .status(400)
      .send(`The booking with the id: ${req.params.id} does not exists  !`);

  const RoomAvaible = await Booking.findOne({
    arrivalDate: { $gte: req.query.arrivalDate },
    departureDate: { $lt: req.query.departureDate },
    roomId: req.params.id,
  });

  if (RoomAvaible && RoomAvaible.isApproved)
    return res.status(400).send(`The room is not avaible on those dates !`);

  const newBooking = await Booking.findOneAndUpdate(
    {
      arrivalDate: req.query.arrivalDate,
      departureDate: req.query.departureDate,
      roomId: req.query.roomId,
      _id: req.params.id,
    },
    { new: true }
  );
 
  res.status(200).send(newBooking);
});

module.exports = router;
