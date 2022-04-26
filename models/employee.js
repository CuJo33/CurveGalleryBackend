const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const { ObjectId } = require("mongodb");

const EmployeeSchema = new Scheme({
  employeeId: {
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
  token: {
    type: ObjectId,
    required: true,
  },
  firstName: String,
  surname: String,
  role: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = Employee = mongoose.model("Employee", EmployeeSchema);
