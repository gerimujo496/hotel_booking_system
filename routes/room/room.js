const express = require('express');
const { Room } = require('../../models/room');
const validateRoom = require('./roomValidation');
const mongoose = require('mongoose'); 
const { Booking } = require('../../models/booking');


const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - type
 *         - number
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the room
 *         type:
 *           type: string
 *           description: The type of room (e.g., Single, Double)
 *         number:
 *           type: integer
 *           description: The room number
 *         description:
 *           type: string
 *           description: A brief description of the room
 *         numberOfBeds:
 *           type: integer
 *           description: The number of beds in the room
 *         example:
 *         type: Single
 *         number: 101
 *         description: A cozy single room with a sea view.
 *         numberOfBeds: 1
 */

/**
 * @swagger
 * /api/room:
 *   get:
 *     summary: Retrieve a list of all the rooms or available rooms by date
 *     parameters:
 *       - in: query
 *         name: arrivalDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Arrival date
 *       - in: query
 *         name: departureDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date
 *     responses:
 *       200:
 *         description: A list of rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       404:
 *         description: No available rooms found.
 *       500:
 *         description: An error occurred.
 */

router.get('/', async (req, res) => {
    try {
        const { arrivalDate, departureDate } = req.query;

        if(!arrivalDate && !departureDate){
            const room = await Room.find({});
            return res.send(room);
        }
        const arrival = new Date(arrivalDate);
        const departure = new Date(departureDate);
 
        const bookedRooms = await Booking.find({
            $or: [
                {
                    arrivalDate: { $lte: departure,$gte: arrival  },
                    departureDate: { $gte: arrival, $lte: departure }
                }
            ]
        }).select("roomId");
       
        const bookedRoomIds = bookedRooms.map(booking => booking.roomId);

        const availableRooms = await Room.find({
            _id: { $nin: bookedRoomIds }
        });
        if (availableRooms.length === 0) return res.status(404).send('There are no available rooms in the provided dates');
        res.send(availableRooms);
    } catch (err) {
        res.status(500).send('An error occurred while getting the room.');
    }
});
/**
 * @swagger
 * /api/room/{id}:
 *   get:
 *     summary: Retrieve a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: A single room.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The room was not found.
 *       400:
 *         description: Invalid ID format.
 *       500:
 *         description: An error occurred.
 */

router.get('/:id', async (req, res) => {
    const roomId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).send('The room was not found');
        res.send(room);
    } catch (err) {
        res.status(500).send('An error occurred while retrieving the room');
    }
});
/**
 * @swagger
 * /api/room:
 *   post:
 *     summary: Create a new room
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

router.post('/', async (req, res) => {
    try {
        const { error } = validateRoom(req.body);
         if (error) return res.status(400).send(error.details[0].message);

        const room = new Room({
            type:req.body.type,
            number:req.body.number,
            description:req.body.description,
            numberOfBeds:req.body.numberOfBeds
        });

        const savedRooms = await room.save();
        
        res.send(savedRooms);
    } catch (err) {
        res.status(500).send('An error occurred while saving the rooms.');
    }
});
/**
 * @swagger
 * /api/room/{id}:
 *   put:
 *     summary: Update an existing room
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
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

router.put('/:id', async (req, res) => {

    const roomId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).send('Invalid ID format');
    }
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).send('The room was not found');

        const { error } = validateRoom(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        room.type= req.body.type,
        room.number=req.body.number,
        room.description=req.body.description,
        room.numberOfBeds=req.body.numberOfBeds
        const updatedRoom = await room.save();

    res.send(updatedRoom);
    } catch (err) {
        res.status(500).send('An error occurred while updating the room.');
    }
});
/**
 * @swagger
 * /api/room/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully.
 *       404:
 *         description: The room with this ID was not found.
 *       500:
 *         description: An error occurred.
 */
router.delete('/:id', async (req, res) => {
    try {
       const room= await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).send('The room with this ID was not found');
            
        res.send(room);
    } catch (err) {
        res.status(500).send('An error occurred while deleting the room.');
    }
});

 module.exports = router;