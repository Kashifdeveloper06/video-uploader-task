const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
})


exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id});

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.param.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to update this user`,
        401
      )
    );
  }

  user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.user._id}`, 404)
    );
  }

  if (
    user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user._id} is not authorized to delete this user`,
        401
      )
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
