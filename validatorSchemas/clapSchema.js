const Joi = require("joi");

module.exports = {
  addClap: Joi.object({
    claps: Joi.number().integer().required(),
    ideaId: Joi.number().integer().required()
  }),
  
};


