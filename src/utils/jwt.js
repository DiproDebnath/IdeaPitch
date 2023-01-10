const jwt = require("jsonwebtoken");
const { JWT_AT_EXP, JWT_SECRET } = require("../config/config");

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_AT_EXP });
  return token;
};

const validateAccessToken = async (token) => {
  const decoded = await jwt.verify(token, JWT_SECRET);
  return decoded;
};

module.exports = {
  generateToken,
  validateAccessToken,
};
