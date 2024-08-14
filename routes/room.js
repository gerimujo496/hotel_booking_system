const express = require('express');
const {Room} = require('../models/room');

const validateRoom = require('../validation/roomValidation');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const room = await Room.find({});
        res.send(room);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).send('The room was not found');
        res.send(room);
    } catch (err) {
        res.status(400).send('Invalid ID format');
    }
});
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
router.put('/:id', async (req, res) => {
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