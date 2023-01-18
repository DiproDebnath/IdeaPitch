const Joi = require("joi");

const getUserById = Joi.object({
  userId: Joi.string().required(),
});

module.exports = {
  getUserByIdValidator: (args) => getUserById.validate(args),
};
