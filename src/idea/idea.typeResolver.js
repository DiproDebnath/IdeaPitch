const { getUserById } = require("../user/user.service");

const ideaTypeRosolver = {
  owner: async (root) => {
    const user = await getUserById({ _id: root.owner });

    return user.toJSON();
  },
};

module.exports = ideaTypeRosolver;
