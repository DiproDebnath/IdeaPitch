const User = require("../user/user.model");

const authService = {
  createUser: async (args) => {
    const user = await User.create({
      username,
      password,
    });
    return user;
  },
  getUserByUsername: async (username) => {
    return User.findOne({ username });
  },
  isUserExists: async (query= {}) => {
    const isExists = await User.exists(query);
    return isExists;
  },
  generateAccessAndRefreshToken: async (payload) => {

  }
};
module.exports = authService;
