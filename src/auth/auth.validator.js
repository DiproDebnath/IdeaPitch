/* eslint-disable no-param-reassign */
const Joi = require("joi");

const authSchema = Joi.object()
  .options({ abortEarly: false, stripUnknown: true })
  .keys({
    username: Joi.string().required(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case "string.pattern.base":
              err.message =
                "password must contain a-z or A-Z or 0-9 and at least 6 character";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
  });
module.exports = {
  authValidator: (args) => authSchema.validate(args.userAuthInput),
};
