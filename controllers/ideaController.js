const createHttpError = require("http-errors");
const ideaService = require("../services/ideaService");

module.exports = {
  createIdea: async (req, res) => {
    const uploadData = await ideaService.handleFileUpload(req);
    if (!uploadData.success)
      throw createHttpError(uploadData.status, uploadData.message);

    

    const ideaData = await ideaService.createIdea(req, uploadData.thumbnail);

    // if (!ideaData.success)
    // throw createHttpError(ideaData.status, ideaData.message);

    res.json("ideaData.data");
  },
};
