const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose
	.connect(mongoURI)
	.then(() => console.log("SUCCESS:  Connected to DB !"))
	.catch((err) => console.log("FAIL: DB connection =>", err.message || err));
