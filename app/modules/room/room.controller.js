const mongoose = require("mongoose");
const errors = require("../../constants/errors");
const { Room } = require("../../models/room");
const { Booking } = require("../../models/booking");

const getAvailableRoomsForSpecificDates = async (req, res) => {
  try {
    const { arrivalDate, departureDate } = req.query;

    if (!arrivalDate && !departureDate) {
      const room = await Room.find({});
      return res.send(room);
    }
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);

    const bookedRooms = await Booking.find({
      $or: [
        {
          arrivalDate: { $lte: departure },
          departureDate: { $gte: arrival },
        },
      ],
      $and: [{ isApproved: { $ne: null } }, { isApproved: { $ne: false } }],
    }).select("roomId");

    const bookedRoomIds = bookedRooms.map((booking) => booking.roomId);

    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    });
    if (availableRooms.length === 0)
      return res.status(404).send(errors.ROOMS_NOT_AVAILABLE_ON_THOSE_DATES);
    res.send(availableRooms);
  } catch (err) {
    res.status(500).send(() => errors.ERROR_STATUS_500("getting", "room"));
  }
};

const getRoom = async (req, res) => {
  const roomId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).send(errors.INVALID_ID);
  }

  try {
    const room = await Room.findById(roomId);
    if (!room)
      return res.status(404).send(() => errors.NOT_FOUND("room", roomId));
    res.send(room);
  } catch (err) {
    res.status(500).send(() => errors.ERROR_STATUS_500("getting", "room"));
  }
};

const createRoom = async (req, res) => {
    try {
      const room = new Room({
        type: req.body.type,
        number: req.body.number,
        description: req.body.description,
        numberOfBeds: req.body.numberOfBeds,
      });
  
      const savedRooms = await room.save();
  
      res.send(savedRooms);
    } catch (err) {
      res.status(500).send(() => errors.ERROR_STATUS_500("saving", "room"));
    }
  }

const updateRoom = async (req, res) => {
    const roomId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).send(errors.INVALID_ID);
    }
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).send(() => errors.NOT_FOUND("room", roomId));
  
      const { error } = validateRoom(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      (room.type = req.body.type),
        (room.number = req.body.number),
        (room.description = req.body.description),
        (room.numberOfBeds = req.body.numberOfBeds);
      const updatedRoom = await room.save();
  
      res.send(updatedRoom);
    } catch (err) {
      res.status(500).send(() => errors.ERROR_STATUS_500("updating", "room"));
    }
  }

  const deleteRoom = async (req, res) => {
    try {
      const roomReferenceInBooking = await Booking.findOne({
        roomId: req.params.id,
      });
  
      if (roomReferenceInBooking) {
        return res
          .status(409)
          .send(() => errors.ERROR_STATUS_500("deleting", "room"));
      }
  
      const room = await Room.findByIdAndDelete(req.params.id);
  
      if (!room) {
        return res.status(404).send(() => errors.NOT_FOUND("room", req.params.id));
      }
  
      res.send(room);
    } catch (err) {
      res.status(500).send(() => errors.ERROR_STATUS_500("deleting", "room"));
    }
  }



const exportObj = {
    getRoom,
    getAvailableRoomsForSpecificDates,
    createRoom,
    updateRoom,
    deleteRoom
}
module.exports= exportObj