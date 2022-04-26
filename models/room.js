const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const RoomSchema = new Scheme({
  roomId: {
    type: ObjectId,
    required: true,
  },
  roomName: String,
  fullRoomName: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Room = mongoose.model("Room", RoomSchema);
