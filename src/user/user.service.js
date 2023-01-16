const User = require("./user.model");

const userService = {
  getUserByUsername: async (username) => {
    const user = await User.findOne({ username });
    return user;
  },
  getUserById: async (id, select = {}) => {
    const user = await User.findOne({ _id: id }, select);
    return user;
  },
};

module.exports = userService;
