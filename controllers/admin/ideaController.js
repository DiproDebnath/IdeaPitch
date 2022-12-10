const createHttpError = require("http-errors");
const ideaService = require("../../services/ideaService");

module.exports = {
  getAllIdeas: async (req, res) => {
    const args = {
      limit: req.params?.limit ? req.params.limit : 10,
      offset: req.params?.offset ? req.params.offset : 0,
      order: ["id", "ASC"],
      options: ["fundraiser", "order"],
    };
    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getIdeaById: async (req, res) => {
    const args = {
      id: req.params.id,
      options: ["single", "fundraiser"],
    };
    const ideaData = await ideaService.getIdeaById(req.params.id);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  approveIdea: async (req, res) => {
    const ideaValidation = await ideaService.validateIdea(req.params.id);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    const ideaData = await ideaService.approveIdea(req.params.id);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  rejectIdea: async (req, res) => {
    const ideaValidation = await ideaService.validateIdea(req.params.id);

    if (!ideaValidation.success)
      throw createHttpError(ideaValidation.status, ideaValidation.message);

    const updatedIdea = await ideaService.rejectIdea(req.params.id, req.body.note);

    if (!updatedIdea.success)
      throw createHttpError(updatedIdea.status, updatedIdea.message);

    res.json(updatedIdea.data);
  },
};
