const createHttpError = require("http-errors");
const ideaService = require("../services/ideaService");
const userService = require("../services/userService");
module.exports = {
  getUserById: async (req, res) => {
    const userData = await userService.getUserById(req.params.id);

    if (!userData.success)
      throw createHttpError(userData.status, userData.message);

    res.json(userData.data);
  },
  getOwnIdea: async (req, res) => {

    const args = {
      userId: req.user.id,
      limit: req.params?.limit ? req.params.limit : 10,
      offset: req.params?.offset ? req.params.offset : 0,
      order: ["id", "ASC"],
      options: ["userIdea", "claps", "donor", "order"],
    };
    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getFundedIdea: async (req, res) => {
   
    
    const args = {
      limit: req.params?.limit ? req.params.limit : 10,
      offset: req.params?.offset ? req.params.offset : 0,
      userId: req.user.id,
      options: [ "dontedIdea", "claps", 'fundraiser', ],
    };
    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
  getOwnIdeaById: async (req, res) => {
    const args = {
      id: req.params.id,
      userId: req.user.id,
      options: ["single", "userIdea", "claps", "donor",],
    };
    const ideaData = await ideaService.getIdeas(args);

    if (!ideaData.success)
      throw createHttpError(ideaData.status, ideaData.message);

    res.json(ideaData.data);
  },
};
