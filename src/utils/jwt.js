const jwt = require("jsonwebtoken");
const { JWT_AT_EXP, JWT_SECRET, JWT_RT_EXP } = require("../config/config");

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_AT_EXP });
  return token;
};
const generateRefreshToken = async (payload) => {
  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RT_EXP });
  return token;
};

const validateToken = async (token) => {
  const decoded = await jwt.verify(token, JWT_SECRET);
  return decoded;
};

module.exports = {
  generateToken,
  validateToken,
  generateRefreshToken,
};
