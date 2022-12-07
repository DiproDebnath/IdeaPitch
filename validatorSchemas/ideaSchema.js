const Joi = require("joi");

module.exports = {
  createIdea: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number().required(),
  }),
  

};


