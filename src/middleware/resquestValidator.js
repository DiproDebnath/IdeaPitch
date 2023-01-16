const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
  HTTP_CODE_500_MESSAGE,
} = require("../utils/constants");
const throwError = require("../utils/errorHandler");
const validationMessage = require("../utils/validationMessageFormatter");

const requestValidator =
  (validator) => (next) => (root, args, context, info) => {
    try {
      const validateSignUpRequest = validator(args);

      if (validateSignUpRequest.error) {
        const validationError = validationMessage(
          validateSignUpRequest.error.details
        );
        return throwError(
          HTTP_CODE_422_CODE,
          HTTP_CODE_422_MESSAGE,
          validationError
        );
      }

      return next(root, args, context, info);
    } catch (err) {
      return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
    }
  };

module.exports = requestValidator;
