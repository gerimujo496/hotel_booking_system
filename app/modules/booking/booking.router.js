const express = require("express");
const Passport = require("passport");
const authorization = require("./booking.authorization");
const controller = require("./booking.controller");
const router = express.Router();

const BASE_ROUTE = "/booking";

const routes = {
  MAKE_REQUEST_BOOKING: `${BASE_ROUTE}/requestToBook/`,
  DELETE_BOOKING: `${BASE_ROUTE}/requestToBook/:bookingId`,
  GET_BOOKING: `${BASE_ROUTE}/requestToBook/:bookingId`,
  PUT_BOOKING: `${BASE_ROUTE}/requestToBook/:bookingId`,
  GET_CURRENT_CLIENT: `${BASE_ROUTE}/getCurrentClient`,
  GET_BOOKING_HISTORY: `${BASE_ROUTE}/getBookingHistory`,
  GET_VOUCHER_BOOKING: `${BASE_ROUTE}/getVoucher/:bookingId`,
};

/**
 * @swagger
 * /booking/requestToBook/:
 *   post:
 *     summary: Request to book a room
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: arrivalDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The arrival date for the booking
 *         example: "2024-08-20"
 *       - in: query
 *         name: departureDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The departure date for the booking
 *         example: "2024-08-25"
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room to be booked
 *         example: "66bb7a3a3af4bc9b772d218d"
 *     responses:
 *       201:
 *         description: Booking request successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The booking ID
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who made the booking
 *                 roomId:
 *                   type: string
 *                   description: The ID of the booked room
 *                 arrivalDate:
 *                   type: string
 *                   format: date
 *                   description: The arrival date of the booking
 *                 departureDate:
 *                   type: string
 *                   format: date
 *                   description: The departure date of the booking
 *                 isApproved:
 *                   type: boolean
 *                   description: Whether the booking is approved or not
 *                   example: null
 *       400:
 *         description: Bad request - Invalid request, room does not exist, or room not available
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 invalidRequest:
 *                   summary: Missing required parameters
 *                   value: "Invalid Request"
 *                 roomNotFound:
 *                   summary: Room does not exist
 *                   value: "The room does not exist!"
 *                 roomNotAvailable:
 *                   summary: Room not available for the selected dates
 *                   value: "The room is not available on those dates!"
 *       500:
 *         description: Server error
 */

router
  .route(routes.MAKE_REQUEST_BOOKING)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.makeBookingAuthorization,
    controller.makeBooking
  );

/**
 * @swagger
 * /booking/requestToBook/{bookingId}:
 *   delete:
 *     summary: Delete a booking request
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to be deleted
 *         example: "66bc7050f6897b0c3206fe42"
 *     responses:
 *       200:
 *         description: Booking successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Whether the request was acknowledged
 *                 deletedCount:
 *                   type: number
 *                   description: The number of documents deleted
 *               example:
 *                 acknowledged: true
 *                 deletedCount: 1
 *       400:
 *         description: Bad request - Invalid booking ID or booking does not exist
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 invalidRequest:
 *                   summary: Missing or invalid booking ID
 *                   value: "Invalid Request"
 *                 bookingNotFound:
 *                   summary: Booking does not exist
 *                   value: "The booking with the id: 66bc7050f6897b0c3206fe42 does not exist!"
 *       500:
 *         description: Server error
 */

router
  .route(routes.DELETE_BOOKING)
  .delete(
    Passport.authenticate("jwt", { session: false }),
    authorization.deleteBookingAuthorization,
    controller.deleteBooking
  );


/**
 * @swagger
 * /booking/requestToBook/{bookingId}:
 *   get:
 *     summary: Retrieve booking details by booking ID
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to retrieve
 *         example: "66bc7050f6897b0c3206fe42"
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the booking
 *                 userId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the user
 *                     firstName:
 *                       type: string
 *                       description: The first name of the user
 *                     lastName:
 *                       type: string
 *                       description: The last name of the user
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                 roomId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the room
 *                     type:
 *                       type: string
 *                       description: The type of the room
 *                     number:
 *                       type: number
 *                       description: The room number
 *                     description:
 *                       type: string
 *                       description: A description of the room
 *                 arrivalDate:
 *                   type: string
 *                   format: date
 *                   description: The arrival date of the booking
 *                 departureDate:
 *                   type: string
 *                   format: date
 *                   description: The departure date of the booking
 *                 isApproved:
 *                   type: boolean
 *                   description: Whether the booking is approved
 *               example:
 *                 _id: "66bc7050f6897b0c3206fe42"
 *                 userId:
 *                   _id: "66bc7025f6897b0c3206fe3f"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john.doe@example.com"
 *                 roomId:
 *                   _id: "66bb7a3a3af4bc9b772d218d"
 *                   type: "Double"
 *                   number: 101
 *                   description: "A spacious double room with a view."
 *                 arrivalDate: "2024-08-15T12:00:00Z"
 *                 departureDate: "2024-08-20T12:00:00Z"
 *                 isApproved: true
 *       400:
 *         description: Bad request - Invalid booking ID or booking does not exist
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 invalidRequest:
 *                   summary: Missing or invalid booking ID
 *                   value: "Invalid Request"
 *                 bookingNotFound:
 *                   summary: Booking does not exist
 *                   value: "The booking with the id: 66bc7050f6897b0c3206fe42 does not exist!"
 *       500:
 *         description: Server error
 */
router
  .route(routes.GET_BOOKING)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingAuthorization,
    controller.getBooking
  );

/**
 * @swagger
 * /booking/requestToBook/{bookingId}:
 *   put:
 *     summary: Update booking details by booking ID
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to update
 *         example: "66bc7050f6897b0c3206fe42"
 *       - in: query
 *         name: arrivalDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The new arrival date for the booking
 *         example: "2024-08-15T12:00:00Z"
 *       - in: query
 *         name: departureDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The new departure date for the booking
 *         example: "2024-08-20T12:00:00Z"
 *       - in: query
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room to update the booking with
 *         example: "66bb7a3a3af4bc9b772d218d"
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the booking
 *                 arrivalDate:
 *                   type: string
 *                   format: date
 *                   description: The updated arrival date of the booking
 *                 departureDate:
 *                   type: string
 *                   format: date
 *                   description: The updated departure date of the booking
 *                 roomId:
 *                   type: string
 *                   description: The ID of the room associated with the booking
 *                 isApproved:
 *                   type: boolean
 *                   description: Whether the booking is approved
 *               example:
 *                 _id: "66bc7050f6897b0c3206fe42"
 *                 arrivalDate: "2024-08-15T12:00:00Z"
 *                 departureDate: "2024-08-20T12:00:00Z"
 *                 roomId: "66bb7a3a3af4bc9b772d218d"
 *                 isApproved: null
 *       400:
 *         description: Bad request - Invalid request parameters or booking does not exist
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               examples:
 *                 invalidRequest:
 *                   summary: Missing required parameters
 *                   value: "Invalid Request!"
 *                 bookingNotFound:
 *                   summary: Booking does not exist
 *                   value: "The booking with the id: 66bc7050f6897b0c3206fe42 does not exist!"
 *       500:
 *         description: Server error
 */


router
  .route(routes.PUT_BOOKING)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.putBookingAuthorization,
    controller.updateBooking
  );

  /**
 * @swagger
 * /booking/getCurrentClient:
 *   get:
 *     summary: Get the list of current clients with ongoing bookings
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of current clients with ongoing bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the client
 *                   firstName:
 *                     type: string
 *                     description: The first name of the client
 *                   lastName:
 *                     type: string
 *                     description: The last name of the client
 *                   email:
 *                     type: string
 *                     description: The email of the client
 *               example:
 *                 - _id: "66bc7050f6897b0c3206fe42"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john.doe@example.com"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router
  .route(routes.GET_CURRENT_CLIENT)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getCurrentClient,
    controller.getCurrentClient
  );

  /**
 * @swagger
 * /booking/getBookingHistory:
 *   get:
 *     summary: Get booking history of the current client
 *     tags:
 *       - Client Bookings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Booking history of the current client
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the booking
 *                   arrivalDate:
 *                     type: string
 *                     format: date
 *                     description: The arrival date of the booking
 *                   departureDate:
 *                     type: string
 *                     format: date
 *                     description: The departure date of the booking
 *                   roomId:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The type of room
 *                       numberOfBeds:
 *                         type: integer
 *                         description: The number of beds in the room
 *                       description:
 *                         type: string
 *                         description: The description of the room
 *                   isApproved:
 *                     type: boolean
 *                     description: Whether the booking is approved
 *               example:
 *                 - _id: "66bc7050f6897b0c3206fe42"
 *                   arrivalDate: "2024-08-10T12:00:00Z"
 *                   departureDate: "2024-08-15T12:00:00Z"
 *                   roomId:
 *                     type: "Double"
 *                     numberOfBeds: 2
 *                     description: "A spacious double room with a sea view."
 *                   isApproved: true
 *       400:
 *         description: Bad request - Invalid request or user not found
 *       500:
 *         description: Server error
 */

router
  .route(routes.GET_BOOKING_HISTORY)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingHistoryAuthorization,
    controller.getBookingHistory
  );

  /**
 * @swagger
 * /booking/getVoucher/{bookingId}:
 *   get:
 *     summary: Get a voucher PDF for a specific booking
 *     tags:
 *       - Vouchers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the booking for which to generate the voucher
 *     responses:
 *       200:
 *         description: PDF voucher for the booking
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Type:
 *             description: The MIME type of the file
 *             schema:
 *               type: string
 *               example: application/pdf
 *           Content-Disposition:
 *             description: The file's disposition and filename
 *             schema:
 *               type: string
 *               example: attachment; filename=voucher.pdf
 *       401:
 *         description: Unauthorized request - the user is not the owner of the booking
 *       404:
 *         description: The booking with the given ID does not exist
 *       500:
 *         description: Internal server error
 */

router
  .route(routes.GET_VOUCHER_BOOKING)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getVoucherDocumentAuthorization,
    controller.getVoucher
  );

module.exports = router;
