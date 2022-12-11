const {
  User,
  Idea,
  Clap,
  IdeaFund,
  UserFund,
  sequelize,
} = require("../models");
const { Op, fn, col } = require("sequelize");
const slugify = require("slugify");
const moment = require("moment");

const maxFileSize = 2097152;

const ideaService = {
  getIdeas: async (args) => {
    const formatedData = ideaService.createQueryData(args);
    const { singlequery, queryOptions } = formatedData;
    try {
      let idea = null;
      if (singlequery) {
        queryOptions.where.id = args.id;
        idea = await Idea.findOne(queryOptions);
        if (!idea.id) {
          return {
            success: false,
            status: 404,
            message: "No Idea found",
          };
        }
      } else {
        queryOptions.limit = args.limit;
        queryOptions.offset = args.offset;
        queryOptions.group = ["Idea.id"];
        idea = await Idea.findAll(queryOptions);

        if (!idea.length) {
          return {
            success: false,
            status: 404,
            message: "No Idea found",
          };
        }
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
  createQueryData: (args) => {
    let singlequery = false;
    let queryOptions = {
      attributes: {
        include: [],
      },
      include: [],
      where: {},
    };
    // inserting params for query object
    args.options.forEach((key) => {
      switch (key) {
        case "single":
          singlequery = true;
          break;
        case "claps":
          queryOptions.subQuery = false;
          queryOptions.attributes.include.push([
            fn("SUM", col("Claps.claps")),
            "numClaps",
          ]);
          queryOptions.include.push({
            model: Clap,
            attributes: [],
          });
          break;
        case "donor":
          queryOptions.include.push({
            model: User,
            as: "Donor",
            attributes: ["id", "username"],
            through: {
              attributes: [],
              where: { isReturn: false },
            },
          });
          break;
        case "fundraiser":
          queryOptions.include.push({
            model: User,
            as: "fundRaiser",
            attributes: ["id", "username"],
          });
          break;
        case "dontedIdea":
          queryOptions.include.push({
            model: IdeaFund,
            attributes: [],
            where: { isReturn: false, userId: args.userId },
            required: true,
          });
          break;
        case "public":
          queryOptions.where.isApproved = "approved";
          break;
        case "userIdea":
          queryOptions.where.userId = args.userId;
          break;

        case "order":
          queryOptions.order = [args.order];
          break;
        default:
          break;
      }
    });
    return {
      queryOptions,
      singlequery,
    };
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
  updateIdea: async (req) => {
    try {
      const IdeaData = {};
      if (req.body.title) {
        IdeaData.title = req.body.title;
      }
      if (req.body.description) {
        IdeaData.description = req.body.description;
      }
      if (req.body.thumbnail) {
        IdeaData.thumbnail = req.body.thumbnail;
      }

      if (req.body.budget) {
        IdeaData.budget = req.body.budget;
      }

      await Idea.update(IdeaData, {
        where: {
          id: req.params.id,
        },
      });

      const idea = await Idea.findOne({
        where: {
          id: req.params.id,
        },
      });
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
  deleteIdea: async (id) => {
    try {
     

      const idea = await Idea.destroy({
        where: {
          id
        },
      });
      console.log(idea);
      return {
        success: true,
        message: "idea is successfully deleted"
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
        console.log(file);
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

        if (file.size > maxFileSize) {
          return {
            success: false,
            status: 422,
            message: "maximum file size limit 2MB",
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
  approveIdea: async (id) => {
    try {
      await Idea.update(
        {
          isApproved: "approved",
        },
        {
          where: {
            id,
          },
        }
      );

      const idea = await Idea.findOne({
        where: {
          id,
        },
      });

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
  rejectIdea: async (id, note) => {
    try {
      await Idea.update(
        {
          isApproved: "rejected",
          note,
        },
        {
          where: {
            id,
          },
        }
      );

      const idea = await Idea.findOne({
        where: {
          id,
        },
      });

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
  sendFund: async (fundData, userFund, idea) => {
    const userFundLeft = Number(userFund.amount) - Number(fundData.amount);
    const totalFund = Number(idea.totalFund) + Number(fundData.amount);

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

      await Idea.update(
        {
          totalFund,
        },
        {
          where: {
            id: fundData.ideaId,
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
  returnFund: async (fund, totalFund, ideaId, userId) => {
    const t = await sequelize.transaction();

    try {
      await IdeaFund.update(
        {
          isReturn: true,
        },

        {
          where: {
            ideaId,
            userId,
          },
          transaction: t,
        }
      );

      await UserFund.update(
        {
          amount: fund,
        },
        {
          where: {
            userId: userId,
          },
          transaction: t,
        }
      );
      await Idea.update(
        {
          totalFund,
        },
        {
          where: {
            id: ideaId,
          },
          transaction: t,
        }
      );
      await t.commit();

      let userFund = await UserFund.findOne({
        where: {
          userId,
        },
      });

      return {
        success: true,
        data: {
          userFund,
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
  validateIdea: async (id, isApprove = false) => {
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

      if (  isApprove &&  idea.isApproved == "approved") {
        return {
          success: false,
          status: 404,
          message: "Can't update or delete approved idea",
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
          isReturn: false,
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
  validateFundForReturn: async (ideaId, userId) => {
    try {
      const ideaFund = await IdeaFund.findOne({
        where: {
          userId,
          ideaId,
          isReturn: false,
        },
      });
      if (!ideaFund) {
        return {
          success: false,
          status: 404,
          message: "No record found",
        };
      }

      const x = moment(ideaFund.createdAt);
      const y = moment();
      const diff = y.diff(x, "days");
      console.log("time diff", diff);

      if (7 < diff) {
        return {
          success: false,
          status: 400,
          message: "Refund period is expired",
        };
      }
      let userFund = await UserFund.findOne({
        where: {
          userId,
        },
      });

      return {
        success: true,
        data: {
          userFund,
          ideaFund,
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

module.exports = ideaService;
