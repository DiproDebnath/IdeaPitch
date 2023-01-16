const { HTTP_CODE_422_CODE, HTTP_CODE_422_MESSAGE } = require("./constants");
const throwError = require("./errorHandler");
const validationMessage = require("./validationMessageFormatter");

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
