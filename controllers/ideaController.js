const createHttpError = require("http-errors");
const ideaService = require("../services/ideaService");

module.exports = {
  getAllIdeas: async (req, res) => {
    const args = {
      limit: req.params?.limit ? req.params.limit : 10,
      offset: req.params?.offset ? req.params.offset : 0,
      order: ["totalFund", "DESC"],
      options: ["public", "claps", "donor", "fundraiser", "order"],
    };

    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getIdeaById: async (req, res) => {
    const args = {
      id: req.params.id,
      options: ["single", "public", "claps", "donor", "fundraiser"],
    };
    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },

  createIdea: async (req, res) => {
    const slugValidation = await ideaService.checkSlug(req.body.title);

    if (!slugValidation.success)
      throw createHttpError(
        slugValidation.status,
        uploadslugValidationData.message
      );

    const uploadData = await ideaService.handleFileUpload(req);

    if (!uploadData.success)
      throw createHttpError(uploadData.status, uploadData.message);

    const ideaData = await ideaService.createIdea(
      req,
      uploadData.thumbnail,
      slugValidation.slug
    );

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },

  sendFund: async (req, res) => {
    // checking is db has any idea
    const ideaValidation = await ideaService.validateIdea(req.body.ideaId);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    // checking user fund, if idea is owned by user, already funded the idea
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
      fundValidatin.userFund,
      ideaValidation.data.idea
    );

    if (!ideaFundData.success)
      throw createHttpError(ideaFundData.status, ideaFundData.message);

    res.json(ideaFundData.data);
  },

  returnFund: async (req, res) => {
    const ideaValidation = await ideaService.validateIdea(req.params.id);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    // validate ideafund
    const fundValidatin = await ideaService.validateFundForReturn(
      req.params.id,
      req.user.id
    );

    if (!fundValidatin.success)
      throw createHttpError(fundValidatin.status, fundValidatin.message);

    const { userFund, ideaFund } = fundValidatin.data;
    const { idea } = ideaValidation.data;

    const fund = Number(userFund.amount) + Number(ideaFund.amount);
    const totalFund = Number(idea.totalFund) + Number(ideaFund.amount);

    const userFundData = await ideaService.returnFund(
      fund,
      totalFund,
      req.params.id,
      req.user.id
    );

    if (!userFundData.success)
      throw createHttpError(userFundData.status, userFundData.message);

    res.json(userFundData.data);
  },
};
