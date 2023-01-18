const Joi = require("joi");

const createIdea = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  thumbnail: Joi.string(),
  budget: Joi.number().min(1000).required(),
});

const approveIdea = Joi.object({
  id: Joi.string().required(),
});

const updateIdea = Joi.object({
  id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  thumbnail: Joi.string(),
  budget: Joi.number().min(1000),
});

const rejectIdea = Joi.object({
  id: Joi.string().required(),
  note: Joi.string().required(),
});

const sendIdeaFund = Joi.object({
  amount: Joi.number().min(1000).required(),
  ideaId: Joi.string().required(),
});
const returnIdeaFund = Joi.object({
  ideaId: Joi.string().required(),
});

module.exports = {
  createIdeaValidator: (args) => createIdea.validate(args.createIdeaInput),
  updateIdeaValidator: (args) => updateIdea.validate(args.updateIdeaInput),
  rejectIdeaValidator: (args) => rejectIdea.validate(args),
  approveIdeaValidator: (args) => approveIdea.validate(args),
  sendIdeaFundValidator: (args) => sendIdeaFund.validate(args),
  returnIdeaFundValidator: (args) => returnIdeaFund.validate(args),
};
