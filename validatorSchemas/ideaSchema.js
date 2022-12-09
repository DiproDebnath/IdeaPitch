const Joi = require("joi");

module.exports = {
  createIdea: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number().min(1000).required(),
  }),

  
  reject: Joi.object({
    note: Joi.string().required(),
  }),
  sendFund: Joi.object({
    amount: Joi.number().min(1000).required(),
    ideaId:Joi.number().integer().required(),
    note: Joi.string(),
  }),

};
