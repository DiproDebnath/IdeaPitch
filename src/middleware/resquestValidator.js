const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_422_MESSAGE,
} = require("../utils/constants");
const throwError = require("../utils/errorHandler");
const validationMessage = require("../utils/validationMessageFormatter");

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

// const requestValidator = (validator, args) => {
//   const validateSignUpRequest = validator.validate(args);

//   if (validateSignUpRequest.error) {
//     const validationError = validationMessage(
//       validateSignUpRequest.error.details
//     );
//     return throwError(
//       HTTP_CODE_422_CODE,
//       HTTP_CODE_422_MESSAGE,
//       validationError
//     );
//   }
// };

module.exports = requestValidator;
