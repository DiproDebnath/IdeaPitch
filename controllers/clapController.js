const createHttpError = require("http-errors");
const clapService = require("../services/clapService");

module.exports = {
  addClap: async (req, res) => {
   
    // checking claps. return 0 if don't find any
    const validateUserClap = await clapService.validateUserClap(req.user.id, req.body);
   
    if (!validateUserClap.success && validateUserClap.status != 401)
      throw createHttpError(validateUserClap.status, validateUserClap.message);
   
    

     const clapData = await clapService.addClap(validateUserClap, req.user.id, req.body);

     if (!clapData.success)
       throw createHttpError(clapData.status, clapData.message);

    res.json(clapData.data);
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
