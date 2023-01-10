const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_400_MESSAGE,
  HTTP_CODE_400_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
  USER_ALREADY_EXISTS,
} = require("../utils/constants");
const { createUser, isUserExists, getUserByUsername } = require("./auth.service");
const throwError = require("../utils/errorHandler");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const { authValidator } = require("../auth/auth.validator");
const _promise = require("../utils/asyncWrapper");
const { generateToken } = require("../utils/jwt");
const requestValidator = require("../utils/resquestValidator");


const authResolvers = {
  Mutation: {
    signIn: async (_, args) => {

        const userRequestData = ({username, password} = args.userAuthInput);
      try {
        const getUserRes = await getUserByUsername(username);
        if (!getUserRes) {
          return throwError(HTTP_CODE_400_CODE, HTTP_CODE_400_MESSAGE);
        }

        const token = await generateToken({
          id: getUserRes.id,
          username: getUserRes.username,
          role: getUserRes.role,
        });

        getUserRes.accessToken = token;
        return getUserRes;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    signUp: async (_, args, ctx) => {
      try {
        const userRequestData = ({username, password} = args.userAuthInput);

        const isUserExistsRes = await isUserExists({username});
        if (isUserExistsRes) {
          return throwError(HTTP_CODE_422_CODE, USER_ALREADY_EXISTS);
        }
        const [createUserErr, createUserRes] = await _promise(
          createUser(userRequestData)
        );

        if (createUserErr) {
            console.log(createUserErr);
          return throwError(HTTP_CODE_400_CODE, HTTP_CODE_400_MESSAGE, createUserErr);
        }
        const token = await generateToken({
          id: createUserRes.id,
          username: createUserRes.username,
          role: createUserRes.role,
        });

        createUserRes.accessToken = token;
        return createUserRes;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
  },
};


const resolversComposition = {
    "Mutation.signUp": [requestValidator(authValidator, "userAuthInput")],
    "Mutation.signIn": [requestValidator(authValidator, "userAuthInput")],
  };



const composedResolvers = composeResolvers(authResolvers, resolversComposition)

module.exports = composedResolvers;
