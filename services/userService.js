const { User, Idea, UserFund } = require("../models");

const userService = {
  getUserById: async (id) => {
    try {
      const user = await User.findOne({
        attributes: [
          "id", 'username',
        ],
        include: [
          {
            model : Idea,
            as: "userIdea"
          },

          {
            model : Idea,
            as: "DonatedIdea",
            through: {
              attributes: [],
              where: {isReturn : false}
            },
            
          }
        ],
        where: {
          id,
        },
      });

      if (!user) {
        return {
          success: false,
          status: 404,
          message: "No user found",
        };
      }
      return {
        success: true,
        data: {
          user,
        },
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
  getUserProfile: async (id) => {
    try {
      const user = await User.findOne({
        attributes: [
          "id", 'username',
        ],
        include: [
          {
            model : UserFund
          },
        ],
        where: {
          id,
        },
      });

      return {
        success: true,
        data: {
          user,
        },
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
};

module.exports = userService;
