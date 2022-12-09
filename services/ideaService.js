const { Idea, Clap, IdeaFund, UserFund, sequelize } = require("../models");
const { Op, fn, col } = require("sequelize");
const slugify = require("slugify");

module.exports = {
  getAllIdeas: async (limit, offset) => {
    try {
      const idea = await Idea.findAll({
        subQuery: false,
        attributes: {
          include: [[fn("SUM", col("Claps.claps")), "numClaps"]],
          include: [[fn("SUM", col("IdeaFund.amount")), "totalFundsss"]],
        },
        include: [
          {
            model: Clap,
            attributes: [],
          },
          {
            model: IdeaFund,
            attributes: [],
          },
        ],

        where: {
          isApproved: "approved",
        },
        limit,
        offset,
        group: ["Idea.id"],
      });
      if (!idea.length) {
        return {
          success: false,
          status: 404,
          message: "No Idea found",
        };
      }

      return {
        success: true,
        data: {
          idea,
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
  getIdeaById: async (id) => {
    try {
      const idea = await Idea.findOne({
        attributes: {
          include: [[fn("SUM", col("Claps.claps")), "numClaps"]],
        },
        include: [
          {
            model: Clap,
            attributes: [],
          },
        ],
        where: {
          id,
          isApproved: "approved",
        },
      });

      if (!idea) {
        return {
          success: false,
          status: 404,
          message: "No Idea found",
        };
      }

      return {
        success: true,
        data: {
          idea,
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

  createIdea: async (req, thumbnail, slug) => {
    try {
      const IdeaData = req.body;
      IdeaData.slug = slug;
      IdeaData.userId = req.user.id;
      IdeaData.thumbnail = thumbnail;

      const idea = await Idea.create(IdeaData);

      return {
        success: true,
        data: {
          idea,
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
  checkSlug: async (title) => {
    try {
      let slug = slugify(title, {
        remove: "/[*+~.()'\"!:@]/g",
        lower: true,
      });

      const idea = await Idea.count({
        where: {
          slug: {
            [Op.like]: `${slug}%`,
          },
        },
      });

      slug = idea ? slug + `-${idea}` : slug;

      return {
        success: true,
        slug,
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
  handleFileUpload: async (req) => {
    try {
      if (!req.files) {
        return {
          success: false,
          status: 422,
          message: "thumbnail is required",
        };
      } else {
        const file = req.files.thumbnail;

        const checkFileType =
          file.mimetype == "image/jpeg" ||
          file.mimetype == "image/png" ||
          file.mimetype == "image/webp";

        if (!checkFileType) {
          return {
            success: false,
            status: 422,
            message: "thumbnail type must be jpeg or png or webp ",
          };
        }

        const thumbnail = Date.now().toString() + "_" + file.name;

        await file.mv("./uploads/" + thumbnail);

        return {
          success: true,
          thumbnail,
        };
      }
    } catch (err) {
      return next(createHttpError(500, "Internal server error"));
    }
  },
  validateIdea: async (id, next) => {
    try {
      const idea = await Idea.findOne({
        where: {
          id,
        },
      });

      if (!idea) {
        return {
          success: false,
          status: 404,
          message: "No Idea found",
        };
      }

      return {
        success: true,
        data: {
          idea,
        },
      };
    } catch (err) {
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
  validateUserAndFunds: async (reqData, userId, idea) => {
    try {
      if (idea.userId == userId) {
        return {
          success: false,
          status: 400,
          message: "You can't send to fund your own idea",
        };
      }

      const { ideaId, amount } = reqData;

      const userFund = await UserFund.findOne({
        where: {
          userId,
        },
      });

      if (amount > userFund.amount)
        return {
          success: false,
          status: 400,
          message: "You don't have enough fund",
        };

      const ideaFund = await IdeaFund.findOne({
        where: {
          userId,
          ideaId,
        },
      });

      if (ideaFund)
        return {
          success: false,
          status: 400,
          message: "You have already funded this idea",
        };

      return {
        success: true,
        userFund,
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

  sendFund: async (fundData, userFund) => {
    const userFundLeft = Number(userFund.amount) - Number(fundData.amount);

    const t = await sequelize.transaction();

    try {
      const ideaFund = await IdeaFund.create(fundData, { transaction: t });

      await UserFund.update(
        {
          amount: userFundLeft,
        },
        {
          where: {
            userId: fundData.userId,
          },
          transaction: t,
        }
      );

      await t.commit();

      return {
        success: true,
        data: {
          ideaFund,
        },
      };
    } catch (err) {
      console.log(err);
      await t.rollback();
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
};
