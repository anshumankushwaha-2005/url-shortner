const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the URI in the environment.
 * The process exits if the connection fails, since the API is useless without a DB.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snipify";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
