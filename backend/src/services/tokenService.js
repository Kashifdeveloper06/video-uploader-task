const jwt = require("jsonwebtoken");
const config = require("../config/environment");

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, "your_jwt_secret_key", {
    expiresIn: '30d',
  });
};
