const User = require("../user/user.model");

const authService = {
  createUser: async (args) => {
    const user = await User.create({
      username,
      password,
    });
    return user;
  },
};
module.exports = authService;
