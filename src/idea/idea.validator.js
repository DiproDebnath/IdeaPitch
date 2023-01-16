const Joi = require("joi");

const createIdea = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  thumbnail: Joi.string(),
  budget: Joi.number().min(1000).required(),
});
const updateIdea = Joi.object({
  id: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  thumbnail: Joi.string(),
  budget: Joi.number().min(1000),
});

const reject = Joi.object({
  note: Joi.string().required(),
});
const sendFund = Joi.object({
  amount: Joi.number().min(1000).required(),
  ideaId: Joi.number().integer().required(),
  note: Joi.string(),
});

module.exports = {
  createIdeaValidator: (args) => createIdea.validate(args.createIdeaInput),
  updateIdeaValidator: (args) => updateIdea.validate(args.updateIdeaInput),
};
