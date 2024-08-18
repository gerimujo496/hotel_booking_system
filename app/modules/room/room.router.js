const Passport = require("passport");
const express = require("express");

const authorization = require("./room.authorization");
const controller = require("./room.controller");
const validateRoom = require("./room.validation");

const router = express.Router();


const BASE_URL = "/room";

const routes = {
  AVAILABLE_ROOMS_ON_SPECIFIC_DATES: `${BASE_URL}/availableRooms`,
  SPECIFIC_ROOM: `${BASE_URL}/:id`,
  CREATE_ROOM: `${BASE_URL}/`,
};

/**
 * @swagger
 * /room/availableRooms:
 *   get:
 *     summary: Retrieve a list of available rooms by date
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/ArrivalDateParam'
 *       - $ref: '#/components/parameters/DepartureDateParam'
 *     responses:
 *       200:
 *         description: A list of available rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */

router
  .route(routes.AVAILABLE_ROOMS_ON_SPECIFIC_DATES)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.availableRoomsOnSpecificDatesAuthorization,
    controller.getAvailableRoomsForSpecificDates
  );

/**
 * @swagger
 * /room/{id}:
 *   get:
 *     summary: Retrieve a specific room by ID
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RoomId'
 *     responses:
 *       200:
 *         description: A specific room.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */

router
  .route(routes.SPECIFIC_ROOM)
  .get(
    Passport.authenticate("jwt", { session: false }),
    authorization.getRoomAuthorization,
    controller.getRoom
  );

/**
 * @swagger
 * /room:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: An error occurred.
 */

router
  .route(routes.CREATE_ROOM)
  .post(
    Passport.authenticate("jwt", { session: false }),
    authorization.createRoomAuthorization,
    validateRoom,
    controller.createRoom
  );

/**
 * @swagger
 * /room/{id}:
 *   put:
 *     summary: Update an existing room
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RoomId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully.
 *       404:
 *         description: The room was not found.
 *       400:
 *         description: Invalid ID format or bad request.
 *       500:
 *         description: An error occurred.
 */

router
  .route(routes.SPECIFIC_ROOM)
  .put(
    Passport.authenticate("jwt", { session: false }),
    authorization.updateRoomAuthorization,
    validateRoom,
    controller.updateRoom
  );

/**
 * @swagger
 * /room/{id}:
 *   delete:
 *     summary: Retrieve a specific room by ID
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RoomId'
 *     responses:
 *       200:
 *         description: A specific room.
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */

router
  .route(routes.SPECIFIC_ROOM)
  .delete(
    Passport.authenticate("jwt", { session: false }),
    authorization.deleteRoomAuthorization,
    controller.deleteRoom
  );



module.exports = router;
