const createHttpError = require('http-errors')
//* Include joi to check error type
const Joi = require('joi')

const Schemas = require('../validatorSchemas')

/**
 *
 * @param {string} schema
 * @param {string} route
 * @returns object
 */
module.exports = function (schema, route) {
  if (!Schemas.hasOwnProperty(schema))
    throw new Error(`'${schema}' schema is not exist`);

  return async function (req, res, next) {
    try {
     
        let validated
      if (req.body.thumbnail == "") {
         validated = await Schemas[schema][route].validateAsync(req.body, {
          allowUnknown: true,
        });
      } else {
         validated = await Schemas[schema][route].validateAsync(req.body);
      }
      req.body = validated;

      next();
    } catch (err) {
        console.log(err);
      if (err.isJoi)
        return next(createHttpError(422, { message: err.message }));
      next(createHttpError(500));
    }
  };
};
