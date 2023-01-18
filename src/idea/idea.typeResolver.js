const { getUserById } = require("../user/user.service");

const ideaTypeRosolver = {
  owner: async (root) => {
    if (!root) {
      return null;
    }
    const user = await getUserById({ _id: root.owner });

    return user.toJSON();
  },
};
const ideaFundResolver = {
  donor: async (parent) => {
    if (!parent) {
      return null;
    }
    const user = getUserById(parent.donor);
    return user;
  },
};

module.exports = {
  ideaTypeRosolver,
  ideaFundResolver,
};
