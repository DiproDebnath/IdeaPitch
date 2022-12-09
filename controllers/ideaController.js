const createHttpError = require("http-errors");
const ideaService = require("../services/ideaService");

module.exports = {
  getAllIdeas: async (req, res) => {
    let limit = req.params?.limit ? req.params.limit : 10;
    let offset = req.params?.offset ? req.params.offset : 0;

    const ideaData = await ideaService.getAllIdeas(limit, offset);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getIdeaById: async (req, res) => {
  
    const ideaData = await ideaService.getIdeaById(req.params.id);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  
  createIdea: async (req, res) => {

    const slugValidation = await ideaService.checkSlug(req.body.title);
    
    if (!slugValidation.success)
      throw createHttpError(slugValidation.status, uploadslugValidationData.message);


    const uploadData = await ideaService.handleFileUpload(req);
    
    if (!uploadData.success)
      throw createHttpError(uploadData.status, uploadData.message);

    

    const ideaData = await ideaService.createIdea(req, uploadData.thumbnail, slugValidation.slug);

    if (!ideaData.success)
    throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
};
