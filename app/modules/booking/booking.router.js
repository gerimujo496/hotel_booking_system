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

router
  .route(routes.MAKE_REQUEST_BOOKING)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.makeBookingAuthorization,
    controller.makeBooking
  );

router
  .route(routes.DELETE_BOOKING)
  .delete(
    Passport.authenticate("jwt", { session: false }),
    authorization.deleteBookingAuthorization,
    controller.deleteBooking
  );

router
  .route(routes.GET_BOOKING)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingAuthorization,
    controller.getBooking
  );

router
  .route(routes.PUT_BOOKING)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.putBookingAuthorization,
    controller.updateBooking
  );

router
  .route(routes.PUT_BOOKING)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.getCurrentClient,
    controller.getCurrentClient
  );

router
  .route(routes.GET_BOOKING_HISTORY)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingHistoryAuthorization,
    controller.getBookingHistory
  );
router
  .route(routes.GET_BOOKING_HISTORY)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingHistoryAuthorization,
    controller.getBookingHistory
  );

router
  .route(routes.GET_VOUCHER_BOOKING)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getVoucherDocumentAuthorization,
    controller.getVoucher
  );

module.exports = router;
