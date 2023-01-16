const uuid = require("uuid").v4;
const User = require("../user/user.model");
const { generateToken, generateRefreshToken } = require("../utils/jwt");

const authService = {
  createUser: async (args) => {
    const user = await User.create({
      username,
      password,
    });
    return user;
  },
  getUserByUsername: async (username) => {
    const user = await User.findOne({ username });
    return user;
  },
  getUserById: async (id, select = {}) => {
    const user = await User.findOne({ _id: id }, select);
    return user;
  },
  isUserExists: async (query = {}) => {
    const isExists = await User.exists(query);
    return isExists;
  },
  validatePassword: async (username, password) => {
    const user = await User.findOne({ username });
    const isValidPassword = await user.comparePassword(password);
    console.log(isValidPassword);
    return isValidPassword;
  },
  generateAccessAndRefreshToken: async (payload) => {
    console.log(payload);
    const token = await generateToken({
      id: payload.id,
      username: payload.username,
      role: payload.role,
    });

    const refreshToken = await generateRefreshToken({
      id: payload.id,
    });

    return {
      token,
      refreshToken,
    };
  },
  saveRefreshToken: async (user, refreshToken) => {
    const deviceId = uuid();
    user.set(`refreshToken.${deviceId}`, refreshToken);
    user.save();
    return deviceId;
  },
};
module.exports = authService;
