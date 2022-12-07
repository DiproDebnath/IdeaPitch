const jwt = require("jsonwebtoken");
const { Idea } = require("../models");

module.exports = {
  createIdea: async (IdeaData) => {
    const idea = Idea.create({});
  },
  handleFileUpload: (req) => {
    try {
      if (!req.files) {
        res.send({
          success: false,
          status: 401,
          message: "No file uploaded",
        });
      } else {


        const thumbnail = req.files.thumbnail.mv("./uploads/" + req.files.thumbnail.name);
console.log(thumbnail);
        return {
          success: true,
          thumbnail
        };
      }
    } catch (err) {
      return {
        success: false,
        status: 500,
        message: "Internal server error",
      };
    }
  },
};
