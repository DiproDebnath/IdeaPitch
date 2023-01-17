const userTypeRosolver = {
  userFund: async (user, args, ctx) => {
    if (user.id === ctx.currentUser.id) return user.userFund;
    return null;
  },
};

module.exports = userTypeRosolver;
