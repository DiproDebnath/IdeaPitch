const Joi = require("joi");

module.exports = {
  aunthentication: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().pattern(
      new RegExp('^[a-zA-Z0-9]{6,30}$')
    ).required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.pattern.base":
              err.message = 'password must contain a-z or A-Z, 0-9 and at least 6 character';
              break;
            default:
              break;
          }
        });
        return errors;
    }),
  }),
  

};


