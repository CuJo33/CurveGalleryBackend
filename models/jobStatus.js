const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const jobStatusSchema = new Scheme({
  jobStatusId: {
    type: ObjectId,
    required: true,
  },
  jobStatusName: String,
  fullJobStatusName: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = jobStatus = mongoose.model("jobStatus", jobStatusSchema);
