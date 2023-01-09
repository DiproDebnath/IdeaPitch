const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_400_MESSAGE,
  HTTP_CODE_400_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
} = require("../utils/constants");
const { createUser } = require("./auth.service");
const throwError = require("../utils/errorHandler");
const validationMessage = require("../utils/validationMessageFormatter");
const { authValidator } = require("./auth.validator");
const _promise = require("../utils/asyncWrapper");
const authResolvers = {
  Mutation: {
    signIn: async (_, args) => {},
    signUp: async (_, args, ctx) => {
      try {
        const payload = ({ username, password } = args.userAuthInput);

        const validateSignUpRequest = authValidator.validate(payload);

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
        const [createUserErr, createUserRes] = await _promise(
          createUser(payload)
        );
        if (createUserErr) {
          return throwError(HTTP_CODE_400_CODE, HTTP_CODE_400_MESSAGE);
        }
        console.log(createUserRes);
        return { username: "asdfa" };
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
  },
};

module.exports = authResolvers;
