const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const ClientSchema = new Scheme({
  clientId: {
    type: ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: ObjectId,
    required: true,
  },
  firstName: String,
  surname: String,
  addressLine1: String,
  addressLine2: String,
  postCode: String,
  telephoneNumber: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Client = mongoose.model("Client", ClientSchema);
