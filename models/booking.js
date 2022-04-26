const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const BookingSchema = new Scheme({
  bookingId: {
    type: ObjectId,
    required: true,
  },
  clientId: {
    type: ObjectId,
    required: true,
  },
  employeeId: {
    type: ObjectId,
    default: "614dab91d76d0c1576f8b9e7",
    required: true,
  },
  requestDate: {
    type: Date,
    required: true,
  },
  requestTime: {
    type: String,
    required: true,
  },
  bookedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Booking = mongoose.model("Booking", BookingSchema);
