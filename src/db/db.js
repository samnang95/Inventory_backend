const mongoose = require("mongoose");

const dbName = process.env.DB_NAME;

// Prefer MONGO_URI if set, otherwise use localhost
const mongoURI = process.env.MONGO_URI || `mongodb://localhost:27017/${dbName}`;

async function dbConnect() {
  mongoose.connection.on("connected", () => {
    console.log("connected: ", dbName || mongoURI);
  });
  await mongoose.connect(mongoURI);
}

module.exports = dbConnect;
