const { Router } = require("express");
const { Passport } = require("passport");
const controller = require("./manager.controller");
const authorization = require("./manager.authorization");
const router = new Router();

const BASE_ROUTE = "/manager";

const routes = {
  BOOKING_APPROVE: `${BASE_ROUTE}/approveBooking/:id`,
  BOOKING_HISTORY: `${BASE_ROUTE}/bookingHistory/`,
};
router
  .route(routes.BOOKING_APPROVE)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.approveBookingAuthorization,
    controller.approveBooking
  );

router
  .route(routes.BOOKING_HISTORY)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getBookingHistoryAuthorization,
    controller.approveBooking
  );

module.exports.manager = router;
