const { Clap } = require("../models");

module.exports = {
  addClap: async (validationData, userId, reqData) => {
    try {
      reqData.userId = userId;

      if (validationData.status == 401) {
        const clap = await Clap.create(reqData);

        return {
          success: true,
          data: {
            clap,
          },
        };
      } else {
        const countClap =
          Number(validationData.data.claps) + Number(reqData.claps);
        reqData.claps = countClap >= 50 ? 50 : countClap;

        await Clap.update(
          { claps: reqData.claps },
          {
            where: {
              ideaId: reqData.ideaId,
              userId,
            },
          }
        );
        const clap = await Clap.findOne({
          where: {
            ideaId: reqData.ideaId,
            userId,
          },
        });

        return {
          success: true,
          data: {
            clap,
          },
        };
      }
    } catch (err) {
      console.log(err);

      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
  getUserClaps: async (ideaId, userId) => {
    try {
      const clap = await Clap.findOne({
        attributes: [
          "claps",
        ],
        where: {
          ideaId,
          userId,
        },
      });

      if (!clap) {
        return {
          success: true,
            data: {
              clap: {
                claps: 0
              },
            },
        };
      }

      return {
        success: true,
        data: {
          clap,
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
  validateUserClap: async (userId, reqData) => {
    try {
      const clap = await Clap.findOne({
        where: {
          ideaId: reqData.ideaId,
          userId,
        },
      });

      if (!clap) {
        return {
          success: false,
          status: 401,
          data: {
            claps: 0,
          },
        };
      }
      if (clap.claps >= 50) {
        return {
          success: false,
          status: 422,
          message: "Claps limit excceeded for this idea",
        };
      }

      return {
        success: true,
        data: {
          claps: clap.claps,
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
