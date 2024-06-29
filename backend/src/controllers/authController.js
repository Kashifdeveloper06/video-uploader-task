const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { sendEmail } = require("../services/emailService");
const { generateToken } = require("../services/tokenService");
const { generatePassword } = require("../utils/passwordGenerator");

exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse("User already exists", 400));
  }

  const password = generatePassword(firstName, lastName, phoneNumber);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });

  const emailContent = `
      <h1>Welcome, ${firstName}!</h1>
      <p>Thank you for creating your account.</p>
      <p>Here are your account details:</p>
      <ul>
        <li>First Name: ${firstName}</li>
        <li>Last Name: ${lastName}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phoneNumber}</li>
        <li>Password: ${password}</li>
      </ul>
      <p>You can log in using your first name and this password.</p>
      <p>Please change your password after your first login.</p>
    `;
  await sendEmail({
    email: user.email,
    subject: "Welcome to Video Platform",
    message: emailContent,
  });

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { firstName, password } = req.body;
  console.log(firstName + ' ' + password);

  if (!firstName || !password) {
    return next(
      new ErrorResponse("Please provide first name and password", 400)
    );
  }

  const user = await User.findOne({ firstName }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const isMatch = await user.matchPassword(password);

  console.log(isMatch)

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };


  res.status(statusCode).cookie("token", token).json({
    success: true,
    token,
  });
};
