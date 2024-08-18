const mongoose = require("mongoose");
const dbTables = require("../constants/db_tables");

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Single", "Double", "Triple", "Deluxe"],
    required: true,
  },
  number: { type: Number, required: true },
  description: { type: String, minLength: 5, maxLength: 500 },
  numberOfBeds: { type: Number, min: 1, max: 5 },
});
const Room = mongoose.model(dbTables.ROOM, roomSchema);
exports.Room = Room;
