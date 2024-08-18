const Passport = require("passport");
const controller = require("./manager.controller");
const authorization = require("./manager.authorization");
const express = require("express");
const expressListRoutes = require("express-list-routes");
const router = express.Router();

const BASE_ROUTE = "/manager";

const routes = {
  BOOKING_APPROVE: `${BASE_ROUTE}/approveBooking/:id`,
  BOOKING_HISTORY: `${BASE_ROUTE}/bookingHistory/`,
};

/**
 * @swagger
 * /manager/approveBooking/{id}:
 *   post:
 *     summary: Approve a booking and update other conflicting bookings.
 *     tags:
 *       - Manager Bookings
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *      - $ref: '#/components/parameters/BookingId'
 *     responses:
 *       200:
 *         description: Successfully approved the booking and updated conflicting bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The booking ID.
 *                 userId:
 *                   type: string
 *                   description: The ID of the user who made the booking.
 *                 roomId:
 *                   type: string
 *                   description: The ID of the booked room.
 *                 arrivalDate:
 *                   type: string
 *                   format: date-time
 *                   description: The arrival date for the booking.
 *                 departureDate:
 *                   type: string
 *                   format: date-time
 *                   description: The departure date for the booking.
 *                 isApproved:
 *                   type: boolean
 *                   description: Indicates whether the booking is approved.
 *       400:
 *         description: Bad request. The booking ID is invalid.
 *       404:
 *         description: The booking with the specified ID was not found.
 *       500:
 *         description: An error occurred while processing the request.
 */

router
  .route(routes.BOOKING_APPROVE)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.approveBookingAuthorization,
    controller.approveBooking
  );

/**
 * @swagger
 * /manager/bookingHistory:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Manager Bookings
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *       200:
 *         description: A list of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The booking ID.
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who made the booking.
 *                   roomId:
 *                     type: string
 *                     description: The ID of the booked room.
 *                   arrivalDate:
 *                     type: string
 *                     format: date-time
 *                     description: The arrival date for the booking.
 *                   departureDate:
 *                     type: string
 *                     format: date-time
 *                     description: The departure date for the booking.
 *                   isApproved:
 *                     type: boolean
 *                     description: Indicates whether the booking is approved.
 *       404:
 *         description: No bookings found in the history.
 *       500:
 *         description: An error occurred while retrieving the bookings.
 */

router
  .route(routes.BOOKING_HISTORY)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingHistoryAuthorization,
    controller.approveBooking
  );

module.exports = router;
