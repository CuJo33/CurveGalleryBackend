const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const QuoteSchema = new Scheme({
  quoteId: {
    type: ObjectId,
    required: true,
  },
  clientId: {
    type: ObjectId,
    required: true,
  },
  employeeId: {
    type: ObjectId,
    required: true,
  },
  jobList: Array,
  clientAccepted: {
    type: Boolean,
    default: false,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Quote = mongoose.model("Quote", QuoteSchema);
