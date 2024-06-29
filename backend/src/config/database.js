const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb://dummyuser1:dhvZj9BFDFMaOnxP@ac-lleklhd-shard-00-00.hzodxwf.mongodb.net:27017,ac-lleklhd-shard-00-01.hzodxwf.mongodb.net:27017,ac-lleklhd-shard-00-02.hzodxwf.mongodb.net:27017/videosUpload?ssl=true&replicaSet=atlas-ochzy5-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0v";

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI, {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
