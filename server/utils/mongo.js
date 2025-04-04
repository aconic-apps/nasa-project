const mongoose = require("mongoose");

require("dotenv").config();

// const MONGO_URL = process.env.MONGO_URL

const MONGO_URL_LEGACY = process.env.MONGO_URL_LEGACY;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL_LEGACY);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
