const express = require("express");
const app = express();
const dotenv = require("dotenv");
var cors = require("cors");
// database configurations
require("./database/index");

// routes import

const userRoute = require("./routes/user.route");
const tailwoRoute = require("./routes/twilio.router");
const grpRoute = require("./routes/group.route");

// enviorment variables configurations
dotenv.config();

app.use(cors({ origin: "http://192.168.2.104:3000" }));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ msg: "Server is up and running" });
});

// middlewares

app.use("/api/user", userRoute);
app.use("/api/grp", grpRoute);
app.use("/api", tailwoRoute);
app.listen(process.env.PORT, () => {
  console.log("server is listening on port : " + process.env.PORT);
});
