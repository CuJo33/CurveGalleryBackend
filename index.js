/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;

const User = require("./models/user");
const Image = require("./models/image")
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage });

var Buffer = require('buffer/').Buffer


mongoose.connect(
    "mongodb+srv://user:B4gwNf8wEtXUSWOS@cluster0.m3j75.mongodb.net/TheCurveGallery?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }, () => {console.log("connected")}
  );


// DELETE THIS LATER
const imageData = {
  imageId: ObjectId(),
  username: 'CuJo',
  image: fs.readFileSync(`passport.jpeg`),
}

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

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
  return res.json({ message: "Hello world 🔥🇵🇹" });
});


app.post("/imagepush", (req, res) => {

  // Push data into the database.

  const image = new Image(imageData);
  image.save()
      .then(() => console.log('Image Saved Successfully!'))
      .then(() => mongoose.connection.close(() => console.log('Connection Closed successfully!')))
      .catch((err) => console.log(`Error in Saving Image: ${err}`));
      console.log("this image" , image.image, "End")
  res.send(image)
    })


  app.get("/imageRender", (req,res) => {
    
    // retrieve data from the database
    
  })


// create a new user function
async function addUser(body, res) {
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
  const newUser = new User(body);
  const userId = ObjectId();
  newUser.userId = userId;
  newUser.token = ObjectId();
  await newUser.save();
  return res.send({
    status: 200,
    message: "Created New User " + newUser.username,
  });
}

// requested data {Email, username, password}
app.post("/signup", async (req, res) => {
    const oldUser = await User.findOne({ username: req.body.username });
    if (oldUser) {
      return res.send({ status: 404, message: `User already exists` });
    }
    await addUser(req.body, res);
});

// User Login
// requires username and password
// returns the auth token
// updates the user table with that token.
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.send({ status: 401, message: "Missing Username" });
  }
  if (req.body.password !== user.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  user.token = ObjectId();
  await user.save();
  res.send({ token: user.token, userId: user.userId, username: user.username });
});

// starting the server
app.listen(port, () => {
  console.log(`listening on  ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
