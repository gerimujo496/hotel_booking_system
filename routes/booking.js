require("express-async-errors");
const express = require("express");
const { Booking } = require("../models/booking");
const { Room } = require("../models/room");
const isClient = require("../middleware/isClient");
const isManager = require("../middleware/isManager");
const PdfPrinter = require("pdfmake");
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

router.get("/getVoucher", isClient, async (req, res) => {
  try {
    const { user } = req;

    // Fetch booking information
    const bookings = await Booking.find({ userId: user._id })
      .populate("userId", "firstName lastName email")
      .populate("roomId", "type number description numberOfBeds")
      .exec();

    if (!bookings || bookings.length === 0) {
      return res.status(404).send("No bookings found");
    }

    // Define fonts for PdfPrinter
    var fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    var printer = new PdfPrinter(fonts);

    // Define the PDF layout
    const docDefinition = {
      content: [
        { text: "Voucher Document", style: "header" },
        { text: "Client Information", style: "subheader" },
        {
          table: {
            widths: ["30%", "70%"],
            body: [
              [
                { text: "Name:", style: "label" },
                {
                  text: `${bookings[0].userId.firstName} ${bookings[0].userId.lastName}`,
                  style: "value",
                },
              ],
              [
                { text: "Email:", style: "label" },
                { text: bookings[0].userId.email, style: "value" },
              ],
            ],
          },
          layout: "noBorders",
        },
        { text: "Booking Details", style: "subheader" },
        ...bookings.map((booking) => ({
          stack: [
            {
              table: {
                widths: ["30%", "70%"],
                body: [
                  [
                    { text: "Room Type:", style: "label" },
                    { text: booking.roomId.type, style: "value" },
                  ],
                  [
                    { text: "Room Number:", style: "label" },
                    { text: booking.roomId.number, style: "value" },
                  ],
                  [
                    { text: "Description:", style: "label" },
                    { text: booking.roomId.description, style: "value" },
                  ],
                  [
                    { text: "Number of Beds:", style: "label" },
                    { text: booking.roomId.numberOfBeds, style: "value" },
                  ],
                  [
                    { text: "Check-in Date:", style: "label" },
                    {
                      text: new Date(booking.arrivalDate).toLocaleDateString(),
                      style: "value",
                    },
                  ],
                  [
                    { text: "Check-out Date:", style: "label" },
                    {
                      text: new Date(
                        booking.departureDate
                      ).toLocaleDateString(),
                      style: "value",
                    },
                  ],
                  [
                    { text: "Booking Status:", style: "label" },
                    {
                      text:
                        booking.isApproved === null
                          ? "Pending"
                          : booking.isApproved
                          ? "Approved"
                          : "Declined",
                      style: "value",
                    },
                  ],
                ],
              },
              layout: {
                hLineColor: "#aaa",
                vLineColor: "#aaa",
              },
              margin: [0, 10, 0, 10],
            },
          ],
        })),
        { text: "Thank you for choosing our service!", style: "thankyou" },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 20],
          color: "#2E86C1",
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 10],
          color: "#2874A6",
        },
        label: { fontSize: 12, bold: true, color: "#34495E" },
        value: { fontSize: 12, color: "#2C3E50" },
        thankyou: {
          fontSize: 14,
          italics: true,
          margin: [0, 30, 0, 0],
          color: "#2ECC71",
          alignment: "center",
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    // Create the PDF document
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
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
