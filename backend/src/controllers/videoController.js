const Video = require("../models/Video");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllVideos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id).populate(
    "user",
    "firstName lastName"
  );

  if (!video) {
    return next(
      new ErrorResponse(`Video not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: video,
  });
});

exports.createVideo = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const video = await Video.create(req.body);

  res.status(201).json({
    success: true,
    data: video,
  });
});

exports.updateVideo = asyncHandler(async (req, res, next) => {
  let video = await Video.findById(req.params.id);

  if (!video) {
    return next(
      new ErrorResponse(`Video not found with id of ${req.params.id}`, 404)
    );
  }

  if (video.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this video`,
        401
      )
    );
  }

  video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: video,
  });
});

exports.deleteVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(
      new ErrorResponse(`Video not found with id of ${req.params.id}`, 404)
    );
  }

  if (video.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this video`,
        401
      )
    );
  }

  await video.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getUserVideos = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  const videos = await Video.find({ user: req.params.userId });

  res.status(200).json({
    success: true,
    count: videos.length,
    data: videos,
  });
});
