const { Idea, Clap } = require("../models");
const { Op, fn, col } = require("sequelize");
const slugify = require("slugify");

module.exports = {
  getAllIdeas: async (limit, offset) => {
    try {
      const idea = await Idea.findAll({
        subQuery: false,
        attributes: {
          include: [[fn("SUM", col("Claps.claps")), "numClaps"]]
        },
        include: [
          {
            model: Clap,
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
          include: [[fn("SUM", col("Claps.claps")), "numClaps"]]
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
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
};
