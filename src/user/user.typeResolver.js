const userTypeRosolver = {
  userFund: async (user, args, ctx) => {
    console.log("userFund", user);
    if (user.id === ctx?.currentUser?.id) return user.userFund;
    return null;
  },
};

module.exports = userTypeRosolver;
