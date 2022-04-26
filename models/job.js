const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const JobSchema = new Scheme({
  jobId: {
    type: ObjectId,
    required: true,
  },
  clientId: {
    type: ObjectId,
    required: true,
  },
  quoteId: {
    type: ObjectId,
  },
  roomId: {
    type: ObjectId,
    required: true,
  },
  serviceId: {
    type: ObjectId,
    required: true,
  },
  jobStatusId: {
    type: ObjectId,
    required: true,
    default: "6152e010d79b5ac940fa0cba", // Not started
  },
  employeeId: {
    type: ObjectId,
    required: true,
    default: "614dab91d76d0c1576f8b9e7", // unassigned
  },
  startDate: {
    type: Date,
  },
  estimatedCompletionDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  clientSignOff: {
    type: Boolean,
    default: false,
  },
  clientSignOffDate: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Job = mongoose.model("Job", JobSchema);
