const Passport = require("passport");
const authorization = require("./room.authorization");
const controller = require("./room.controller");

const express = require("express");
const validateRoom = require("../../routes/room/roomValidation");
const router = express.Router();

const BASE_URL = "/room";

const routes = {
  AVAILABLE_ROOMS_ON_SPECIFIC_DATES: `${BASE_URL}/availableRooms`,
  SPECIFIC_ROOM: `${BASE_URL}/:id`,
  CREATE_ROOM: `${BASE_URL}/`,
};

router
  .route(routes.AVAILABLE_ROOMS_ON_SPECIFIC_DATES)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.availableRoomsOnSpecificDatesAuthorization,
    controller.getAvailableRoomsForSpecificDates
  );

router
  .route(routes.SPECIFIC_ROOM)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getRoomAuthorization,
    controller.getRoom
  );

router
  .route(routes.CREATE_ROOM)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.createRoomAuthorization,
    validateRoom,
    controller.createRoom
  );

router
  .route(routes.SPECIFIC_ROOM)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.updateRoomAuthorization,
    validateRoom,
    controller.updateRoom
  );
router
  .route(routes.SPECIFIC_ROOM)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.deleteRoomAuthorization,
    controller.deleteRoom
  );
module.exports = router;
