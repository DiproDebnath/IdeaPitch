const createHttpError = require("http-errors");
const adminIdeaService = require("../../services/admin/ideaService");

module.exports = {
  getAllIdeas: async (req, res) => {
    let limit = req.params?.limit ? req.params.limit : 10;
    let offset = req.params?.offset ? req.params.offset : 0;

    const ideaData = await adminIdeaService.getAllIdeas(limit, offset);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getIdeaById: async (req, res) => {
    const ideaData = await adminIdeaService.getIdeaById(req.params.id);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  approveIdea: async (req, res) => {
    const ideaValidation = await adminIdeaService.validateIdea(req.params.id);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    const ideaData = await adminIdeaService.approveIdea(req.params.id);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  rejectIdea: async (req, res) => {
    const ideaValidation = await adminIdeaService.validateIdea(req.params.id);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    const updatedIdea = await adminIdeaService.rejectIdea(req.params.id, req.body.note);

    if (!updatedIdea.success)
      throw createHttpError(updatedIdea.status, updatedIdea.message);

    res.json(updatedIdea.data);
  },
};
