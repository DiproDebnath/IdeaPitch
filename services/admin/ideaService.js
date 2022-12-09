const { Idea } = require("../../models");

module.exports = {
  getAllIdeas: async (limit, offset) => {
    try {
      const idea = await Idea.findAll({
        limit,
        offset,
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
  getIdeaById: async (id) => {
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
      console.log(err);

      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },

  validateIdea: async (id) => {
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
          idea
        }
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
          note
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
};
