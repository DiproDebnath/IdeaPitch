const { HTTP_CODE_422_CODE, HTTP_CODE_422_MESSAGE } = require("./constants");
const throwError = require("./errorHandler");
const validationMessage = require("./validationMessageFormatter");

const requestValidator =
  (validator, inputKey) => (next) => (root, args, context, info) => {
    const validateSignUpRequest = validator.validate(args[inputKey]);

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
  };

module.exports = requestValidator;
