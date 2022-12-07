const jwt = require("jsonwebtoken");
const { Idea } = require("../models");

module.exports = {
  createIdea: async (req, thumbnail) => {

    const IdeaData  = req.body;
          IdeaData.thumbnail = thumbnail;
          IdeaData.userId = req.user.id;
    const idea = await Idea.create(IdeaData);

    // console.log(idea);
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

        if (!(file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/webp")) {
          return {
            success: false,
            status: 422,
            message: "thumbnail type must be jpeg or png or webp ",
          };
      } 

        const thumbnail = "./uploads/" + Date.now().toString() + "_" + file.name;

         await file.mv(thumbnail);
        
        return {
          success: true,
          thumbnail
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
