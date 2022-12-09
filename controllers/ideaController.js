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

  sendFund: async (req, res) => {
    const ideaValidation = await ideaService.validateIdea(
      req.body.ideaId
    );

    if (!ideaValidation.success)
     throw createHttpError(ideaValidation.status, ideaValidation.message);


   const fundValidatin = await ideaService.validateUserAndFunds(
      req.body,
      req.user.id,
      ideaValidation.data.idea
    );
    if (!fundValidatin.success)
      throw createHttpError(fundValidatin.status, fundValidatin.message);

    const fundData = {
      amount: req.body.amount,
      userId: req.user.id,
      ideaId: req.body.ideaId,
      note: req.body.note,
    };

    const ideaFundData = await ideaService.sendFund(
      fundData,
      fundValidatin.userFund
    );

    if (!ideaFundData.success)
      throw createHttpError(ideaFundData.status, ideaFundData.message);

    res.json(ideaFundData.data.ideaFund);
  },
};
