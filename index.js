/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;

const Booking = require("./models/booking");
const Client = require("./models/client");
const Employee = require("./models/employee");
const Job = require("./models/job");
const JobStatus = require("./models/jobStatus");
const Quote = require("./models/quote");
const Room = require("./models/room");
const Service = require("./models/service");
const { v4: uuidv4 } = require("uuid");
const { removeAllListeners } = require("nodemon");
const { findOne } = require("./models/booking");

mongoose.connect(
  "mongodb+srv://user:B4gwNf8wEtXUSWOS@cluster0.m3j75.mongodb.net/hawkservices?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// A point to add all things to all tables
app.get("/instance", async (req, res) => {
  const newBooking = new Booking({
    bookingId: ObjectId(),
    clientId: ObjectId(),
    employeeId: ObjectId(),
    requestDate: String(Date.now()),
    bookedDate: String(Date.now()),
    completed: 0,
    lastUpdated: String(Date.now()),
  });
  const newClient = new Client({
    clientId: ObjectId(),
    username: "something",
    password: "password",
    token: ObjectId(),
    firstName: "Joe",
    surname: "Bloggs",
    addressLine1: "7 Queens Gardens",
    addressLine2: "Sheffield",
    postCode: "S2 3RZ",
    telephoneNumber: "07845690406",
    email: "josephcurtislap@gmail.com",
    lastUpdated: String(Date.now()),
  });
  const newEmployee = new Employee({
    employeeId: ObjectId(),
    username: "something",
    password: "password",
    token: ObjectId(),
    firstName: "Joe",
    surname: "Curtis",
    role: "Admin",
    lastUpdated: String(Date.now()),
  });
  const newJob = new Job({
    jobId: ObjectId(),
    clientId: ObjectId(),
    quoteId: ObjectId(),
    roomId: ObjectId(),
    serviceId: ObjectId(),
    jobStatusId: ObjectId(),
    employeeId: ObjectId(),
    startDate: String(Date.now()),
    estimatedCompletionDate: String(Date.now()),
    completedDate: String(Date.now()),
    clientSignOff: 0,
    clientSignOffDate: String(Date.now()),
    lastUpdated: String(Date.now()),
  });
  const newJobStatus = new JobStatus({
    jobStatusId: ObjectId(),
    jobStatusName: "NOTSTARTED",
    fullJobStatusName: "Not Started",
    lastUpdated: String(Date.now()),
  });
  const newQuote = new Quote({
    quoteId: ObjectId(),
    clientId: ObjectId(),
    employeeId: ObjectId(),
    jobList: [ObjectId(), ObjectId(), ObjectId()],
    clientAccepted: 0,
    RequestDate: String(Date.now()),
    lastUpdated: String(Date.now()),
  });
  const newRoom = new Room({
    roomId: ObjectId(),
    roomName: "KITCHEN",
    fullRoomName: "Kitchen",
    lastUpdated: String(Date.now()),
  });
  const newService = new Service({
    serviceId: ObjectId(),
    serviceName: "PAINT",
    fullServiceName: "Paint the Walls",
    specificRoomId: ObjectId(),
    specificResourceId: ObjectId(),
    lastUpdated: String(Date.now()),
  });
  // await newBooking.save();
  // await newEmployee.save();
  // await newClient.save();
  // await newJob.save();
  // await newJobStatus.save();
  // await newQuote.save();
  // await newRoom.save();
  // await newService.save();
  // await newUser.save();
  res.send(true);
});

// create a new client function
async function addClient(body, res) {
  const { email, password, username } = body;
  if (!username || !password || !email) {
    return res.send({
      status: 404,
      message: `Missing ${
        username
          ? password
            ? email
              ? "will never run :)"
              : "Email"
            : "Password"
          : "Username"
      }`,
    });
  }
  const newClient = new Client(body);
  const clientId = ObjectId();
  newClient.clientId = clientId;
  newClient.token = ObjectId();
  await newClient.save();
  return res.send({
    status: 200,
    message: "Created New Client " + newClient.username,
  });
}

// create a new employee function
async function addEmployee(body, res) {
  const { password, username } = body;
  if (!username || !password) {
    return res.send({
      status: 404,
      message: `Missing ${
        username ? (password ? "will never run :)" : "Password") : "Username"
      }`,
    });
  }
  const newEmployee = new Employee(body);
  const EmployeeId = ObjectId();
  newEmployee.employeeId = EmployeeId;
  newEmployee.token = ObjectId();
  await newEmployee.save();
  return res.send({
    status: 200,
    message: "Created New Employee " + newEmployee.username,
  });
}

// update the client table with the additional information
async function updateClient(body, res) {
  const {
    token,
    firstName,
    surname,
    addressLine1,
    addressLine2,
    postCode,
    telephoneNumber,
  } = body;
  // const stringif = JSON.stringify(body);
  // if (stringif.includes("")) {
  //   console.log("missing field");
  // }
  if (
    !firstName ||
    !surname ||
    !addressLine1 ||
    !addressLine2 ||
    !postCode ||
    !telephoneNumber
  ) {
    return {
      status: 404,
      message: `Missing ${
        firstName
          ? surname
            ? addressLine1
              ? addressLine2
                ? postCode
                  ? telephoneNumber
                    ? "will never run :)"
                    : "Telephone Number"
                  : "Post Code"
                : "Address Line 2"
              : "Address Line 1"
            : "Surname"
          : "First name"
      }`,
    };
  }
  const ret = await Client.findOneAndUpdate(
    { token: ObjectId(token) },
    {
      firstName: firstName,
      surname: surname,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      postCode: postCode,
      telephoneNumber: telephoneNumber,
    }
  );
  if (!ret || ret === null) {
    return { status: 404, message: "No data found" };
  }
  return {
    status: 200,
    message: "Client Updated",
    data: ret,
  };
}

// create a new booking
async function addBooking(body, res) {
  const requestDate = body.requestDate;
  const requestTime = body.requestTime;
  console.log(requestDate, requestTime);
  if (!requestDate || !requestTime) {
    return {
      status: 404,
      message: `Missing ${
        requestDate
          ? requestTime
            ? "will never run :)"
            : "Request Time"
          : "Request Date"
      }`,
    };
  }
  const clientId = body.clientId;
  const newBooking = new Booking(body);
  const bookingId = ObjectId();
  newBooking.clientId = clientId;
  newBooking.bookingId = bookingId;
  newBooking.requestDate = requestDate;
  newBooking.requestTime = requestTime;
  await newBooking.save();
  return { status: 200, message: `Success` };
}

// create a new user with a parameter to create either an employee or a client
// if creating an client we add them to the clients table
// if creating an employee we add them to the employee table
// so seperate functions created above
// requested data {Email, username, password}
app.post("/signup/:userType", async (req, res) => {
  if (req.params.userType === "client") {
    const oldUser = await Client.findOne({ username: req.body.username });
    if (oldUser) {
      return res.send({ status: 404, message: `User already exists` });
    }
    await addClient(req.body, res);
  } else if (req.params.userType === "employee") {
    const oldUser = await Employee.findOne({ username: req.body.username });
    if (oldUser) {
      return res.send({ status: 404, message: `User already exists` });
    }
    await addEmployee(req.body, res);
  } else {
    return res.send({ status: 404, message: `That Page Doesn't exist` });
  }
});

// creating log in's
// 2 seperate login pages due to needing to know if client or employee

// Client Login
// requires username and password
// returns the auth token
// updates the client table with that token.
app.post("/login", async (req, res) => {
  const client = await Client.findOne({ username: req.body.username });
  if (!client) {
    return res.send({ status: 401, message: "Missing Username" });
  }
  if (req.body.password !== client.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  client.token = ObjectId();
  await client.save();
  res.send({ token: client.token, clientId: client.clientId });
});

// Employee Login
// requires username and password
// returns the auth token
// updates the Employee table with that token.
app.post("/login/employee", async (req, res) => {
  const employee = await Employee.findOne({ username: req.body.username });
  if (!employee) {
    return res.send({ status: 401, message: "Missing Username" });
  }
  if (req.body.password !== employee.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  employee.token = ObjectId();
  await employee.save();
  res.send({
    token: employee.token,
    employeeId: employee.employeeId,
    role: employee.role,
  });
});

//  Only if we have an auth do next()
// app.use(async (req, res, next) => {
//   const authHeader = req.headers["auth"];
//   // Check if Client and allow through if authed
//   if (!authHeader) {
//     res.sendStatus(403);
//     return;
//   }
//   const client = await Client.findOne({ token: authHeader });
//   console.log(client);
//   if (client) {
//     next();
//   } else {
//     // Check if employee and allow through if authed
//     const employee = await Employee.findOne({ token: authHeader });
//     if (employee) {
//       next();
//     } else {
//       res.sendStatus(403);
//     }
//   }
// });

// defining CRUD operations
// Make a booking by the client
app.post("/booking", async (req, res) => {
  console.log("in booking");
  const response = await updateClient(req.body, res);
  if (response.status === 404) {
    res.send(response);
    return;
  }
  req.body.clientId = response.data.clientId;
  const bookingResponse = await addBooking(req.body, res);
  if (bookingResponse.status === 404) {
    res.send(bookingResponse.message);
    return;
  }
  res.send({ status: 200, message: "Client Updated and New Booking Added" });
});

// Populate booking site if we have the info
app.get("/booking/:clientId", async (req, res) => {
  if (req.params.clientId === "-1") {
    res.send(await Booking.find());
  } else {
    res.send(await Booking.find({ clientId: req.params.clientId }));
  }
});

// Populate booking site if we have the info
app.get("/bookingEmployee/:employeeId", async (req, res) => {
  if (req.params.employeeId === "-1") {
    res.send(await Booking.find());
  } else {
    res.send(await Booking.find({ employeeId: req.params.employeeId }));
  }
});

// update employeeId in booking
app.put("/booking/:bookingId/:employeeId", async (req, res) => {
  const bookingId = ObjectId(req.params.bookingId);
  const employeeId = ObjectId(req.params.employeeId);
  if (!bookingId) {
    return res.send({
      status: 404,
      message: "Missing bookingId",
    });
  }
  if (!employeeId) {
    return res.send({
      status: 404,
      message: "Missing employeeId",
    });
  }
  await Booking.findOneAndUpdate(
    { bookingId: bookingId },
    {
      employeeId: employeeId,
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Booking Updated" });
});

// update job Status Id in jobs
app.put("/jobStatus/:jobId/:jobStatusId", async (req, res) => {
  const jobId = ObjectId(req.params.jobId);
  const jobStatusId = ObjectId(req.params.jobStatusId);
  if (!jobId) {
    return res.send({
      status: 404,
      message: "Missing jobId",
    });
  }
  if (!jobStatusId) {
    return res.send({
      status: 404,
      message: "Missing jobStatusId",
    });
  }
  await Job.findOneAndUpdate(
    { jobId: jobId },
    {
      jobStatusId: jobStatusId,
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Job Updated" });
});

// update job StartDate in jobs
app.put("/jobsStartDate/:jobId", async (req, res) => {
  const jobId = ObjectId(req.params.jobId);
  if (!jobId) {
    return res.send({
      status: 404,
      message: "Missing jobId",
    });
  }
  var newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  await Job.findOneAndUpdate(
    { jobId: jobId },
    {
      startDate: String(Date.now()),
      estimatedCompletionDate: String(newDate),
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Job Updated" });
});

// update job StartDate in jobs
app.put("/jobsCompleteDate/:jobId", async (req, res) => {
  const jobId = ObjectId(req.params.jobId);
  if (!jobId) {
    return res.send({
      status: 404,
      message: "Missing jobId",
    });
  }
  await Job.findOneAndUpdate(
    { jobId: jobId },
    {
      completedDate: String(Date.now()),
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Job Updated" });
});

// update job StartDate in jobs
app.put("/jobsSignOff/:jobId", async (req, res) => {
  const jobId = ObjectId(req.params.jobId);
  if (!jobId) {
    return res.send({
      status: 404,
      message: "Missing jobId",
    });
  }
  await Job.findOneAndUpdate(
    { jobId: jobId },
    {
      clientSignOff: true,
      jobStatusId: "6168116a12eefab8c04cb03b",
      clientSignOffDate: String(Date.now()),
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Job Updated" });
});

// Get the jobStatuses table
// this will feed the drop down menu for the jobs page & the employee update page
app.get("/jobStatus/:jobStatusId", async (req, res) => {
  if (req.params.jobStatusId === "-1") {
    res.send(await JobStatus.find());
  } else {
    res.send(await JobStatus.findOne({ jobStatusId: req.params.jobStatusId }));
  }
});

// Get the rooms table
// this will feed the drop down menu for the jobs page
app.get("/clients/:clientId", async (req, res) => {
  if (req.params.roomId === "-1") {
    res.send(await Client.find());
  } else {
    res.send(await Client.findOne({ clientId: req.params.clientId }));
  }
});

// Get the rooms table
// this will feed the drop down menu for the jobs page
app.get("/rooms/:roomId", async (req, res) => {
  if (req.params.roomId === "-1") {
    res.send(await Room.find());
  } else {
    res.send(await Room.findOne({ roomId: req.params.roomId }));
  }
});

// Get the Services table
// this will feed the drop down menu for the jobs page
app.get("/services/:serviceId", async (req, res) => {
  if (req.params.serviceId === "-1") {
    res.send(await Service.find());
  } else {
    res.send(await Service.findOne({ serviceId: req.params.serviceId }));
  }
});

// Create a new Job
app.post("/job", async (req, res) => {
  const { clientId, roomId, serviceId } = req.body;
  if (!clientId || !roomId || !serviceId) {
    return res.send({
      status: 404,
      message: `Missing ${
        clientId
          ? roomId
            ? serviceId
              ? "will never run :)"
              : "Service"
            : "Room"
          : "Client"
      }`,
    });
  }
  const newJob = new Job(req.body);
  const jobId = ObjectId();
  newJob.jobId = jobId;
  await newJob.save();
  res.send({
    status: 200,
    jobId: jobId,
    message: `New Job Added`,
  });
});

// update a job with the quoteIds
app.put("/updateJob", async (req, res) => {
  const { jobList, quoteId } = req.body;
  try {
    await updateJobQuoteId(jobList, quoteId);
  } catch (error) {
    return res.send({ status: 500, message: `Failed to update Jobs` });
  }
  return res.send({ status: 200, message: `Updated Jobs in quote` });
});

// server iterates over array, and updates jobs with the new quoteId
const updateJobQuoteId = async (array, quoteId) => {
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
    const jobId = array[i];
    await Job.findOneAndUpdate(
      { jobId: jobId },
      {
        quoteId: quoteId,
      }
    );
  }
};

// Get the Quote table
// or specific quotes for a employeeId
app.get("/quotesEmployee/:employeeId", async (req, res) => {
  if (req.params.quoteId === "-1") {
    res.send(await Quote.find());
  } else {
    res.send(await Quote.find({ employeeId: req.params.employeeId }));
  }
});

// create a new quote
app.post("/quote", async (req, res) => {
  const { clientId, employeeId, jobList } = req.body;
  if (!clientId || !employeeId || !jobList) {
    return res.send({
      status: 404,
      message: `Missing ${
        clientId
          ? employeeId
            ? jobList
              ? "will never run :)"
              : "Jobs List"
            : "Employee Id"
          : "Client Id"
      }`,
    });
  }
  const newQuote = new Quote(req.body);
  const quoteId = ObjectId();
  newQuote.quoteId = quoteId;
  try {
    await newQuote.save();
  } catch (error) {
    return res.send({ status: 500, message: `New Quote failed` });
  }
  try {
    await updateJobQuoteId(jobList, quoteId);
  } catch (error) {
    return res.send({
      status: 500,
      message: `Update Jobs with QuoteId failed`,
    });
  }
  return res.send({ status: 200, message: `New Quote created & Jobs updated` });
});

// Get the Quote table
// or specific quotes for a clientId
app.get("/quotes/:clientId", async (req, res) => {
  console.log(req.params.clientId);
  if (req.params.clientId === "-1") {
    console.log("is -1");
    res.send(await Quote.find());
  } else {
    console.log("isnt -1");
    res.send(await Quote.find({ clientId: req.params.clientId }));
  }
});

// Get the Quote table
// or specific quoteId
app.get("/quote/:quoteId", async (req, res) => {
  try {
    res.send(await Quote.find({ quoteId: req.params.quoteId }));
  } catch (error) {
    return res.send({ status: 500, message: `Failed to find Quote` });
  }
});

// Delete a quote
app.delete("/quote/:quoteId", async (req, res) => {
  const quoteToDelete = await Quote.find({
    quoteId: ObjectId(req.params.quoteId),
  });
  const jobsToDelete = quoteToDelete[0].jobList;
  try {
    // deleteJob(jobsToDelete);
  } catch (error) {
    return res.send({ status: 500, message: `Failed to delete Jobs` });
  }
  try {
    await Quote.deleteOne({ quoteId: ObjectId(req.params.quoteId) });
  } catch (error) {
    return res.send({ status: 500, message: `Failed to delete Quote` });
  }
  res.send({ status: 200, message: "Quote and Jobs Deleted" });
});

// Delete a Job
app.delete("/job/:jobId", async (req, res) => {
  try {
    await Job.deleteOne({ jobId: ObjectId(req.params.jobId) });
  } catch (error) {
    return res.send({ status: 500, message: `Failed to delete Job` });
  }
  res.send({ status: 200, message: "Job Deleted" });
});

app.put("/jobs/:jobId/:employeeId", async (req, res) => {
  const jobId = ObjectId(req.params.jobId);
  const employeeId = ObjectId(req.params.employeeId);
  console.log("in backend ", jobId, employeeId);
  if (!jobId) {
    return res.send({
      status: 404,
      message: "Missing jobId",
    });
  }
  if (!employeeId) {
    return res.send({
      status: 404,
      message: "Missing employeeId",
    });
  }
  const data = await Job.findOneAndUpdate(
    { jobId: jobId },
    {
      employeeId: employeeId,
      lastUpdated: String(Date.now()),
    },
    {
      returnOriginal: false,
    }
  );
  res.send({ status: 200, message: "Job Updated", data: data });
});

// Delete an array of Jobs
const deleteJob = async (array) => {
  var arrayLength = array.length;
  for (var i = 0; i < arrayLength; i++) {
    const jobId = array[i];
    await Job.findOneAndDelete({ jobId: jobId });
  }
};

// Accept a quote
app.put("/quote/:quoteId", async (req, res) => {
  const quoteId = ObjectId(req.params.quoteId);
  if (!quoteId) {
    return res.send({
      status: 404,
      message: "Missing quoteId",
    });
  }
  await Quote.findOneAndUpdate(
    { quoteId: quoteId },
    {
      clientAccepted: true,
      lastUpdated: String(Date.now()),
    }
  );
  res.send({ status: 200, message: "Quote Accepted" });
});

// Create a new Room
app.post("/room", async (req, res) => {
  const { fullRoomName } = req.body;
  if (!fullRoomName) {
    return res.send({
      status: 404,
      message: `Missing ${fullRoomName ? "will never run :)" : "Room name"}`,
    });
  }
  const newRoom = new Room(req.body);
  const roomId = ObjectId();
  newRoom.roomId = roomId;
  // create a capitalised version of the fullRoomName with no spaces
  let roomName = fullRoomName.toUpperCase();
  roomName = roomName.replace(/\s+/g, "");
  newRoom.roomName = roomName;
  await newRoom.save();
  res.send({
    status: 200,
    message: `New Room Added`,
  });
});

// Create a new Service
app.post("/service", async (req, res) => {
  const { fullServiceName } = req.body;
  if (!fullServiceName) {
    return res.send({
      status: 404,
      message: `Missing ${
        fullServiceName ? "will never run :)" : "Service name"
      }`,
    });
  }
  const newService = new Service(req.body);
  const serviceId = ObjectId();
  newService.serviceId = serviceId;
  // create a capitalised version of the fullServiceName with no spaces
  let serviceName = fullServiceName.toUpperCase();
  serviceName = serviceName.replace(/\s+/g, "");
  newService.serviceName = serviceName;
  await newService.save();
  res.send({
    status: 200,
    message: `New Service Added`,
  });
});

// Get an employee
app.get("/employee/:employeeId", async (req, res) => {
  if (req.params.employeeId === "-1") {
    res.send(await Employee.find());
  } else {
    res.send(await Employee.findOne({ employeeId: req.params.employeeId }));
  }
});

// Get jobs on quoteId
app.get("/jobsByQuoteId/:quoteId", async (req, res) => {
  res.send(await Job.find({ quoteId: req.params.quoteId }));
});

// Get jobs on quoteId
app.get("/jobsByEmployeeId/:employeeId", async (req, res) => {
  res.send(await Job.find({ employeeId: req.params.employeeId }));
});

// Get the jobs table
app.get("/jobs/:jobId", async (req, res) => {
  if (req.params.jobId === "-1") {
    res.send(await JobStatus.find());
  } else {
    res.send(await Job.findOne({ jobId: req.params.jobId }));
  }
});

// defining CRUD operations
// // get all
// app.get("/", async (req, res) => {
//   res.send(await Event.find());
// });

// // post new
// app.post("/", async (req, res) => {
//   const newEvent = req.body;
//   const event = new Event(newEvent);
//   event.date = new Date(req.body.date).toISOString().slice(0, 10);
//   await event.save();
//   res.send({ message: "New Event Added" });
// });

// // delete
// app.delete("/:id", async (req, res) => {
//   await Event.deleteOne({ _id: ObjectId(req.params.id) });
//   res.send({ message: "Event Deleted" });
// });

// // find and update
// app.put("/:id", async (req, res) => {
//   await Event.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
//   res.send({ message: "Event updated" });
// });

// starting the server
app.listen(port, () => {
  console.log(`listening on  ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
