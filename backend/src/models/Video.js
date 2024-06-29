const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a video title"],
    maxlength: [30, "Title can not be more than 30 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [120, "Description can not be more than 120 characters"],
  },
  url: {
    type: String,
    required: [true, "Please add a video URL"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please add a thumbnail URL"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", VideoSchema);