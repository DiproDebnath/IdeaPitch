const jwt = require("jsonwebtoken");
const { JWT_AT_EXP, JWT_SECRET } = require("../config/config");

const generateToken = async (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_AT_EXP });

const validateAccessToken = async (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  generateToken,
  validateAccessToken,
};
