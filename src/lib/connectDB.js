const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};

module.exports = connectDB;
