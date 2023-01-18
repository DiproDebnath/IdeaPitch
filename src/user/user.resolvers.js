const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const { authenticated } = require("../middleware/auth.middleware");
const userTypeRosolver = require("./user.typeResolver");
const throwError = require("../utils/errorHandler");

const requestValidator = require("../middleware/resquestValidator");
const { getUserById } = require("./user.service");
const { getUserByIdValidator } = require("./user.validator");
const {
  HTTP_CODE_500_CODE,
  HTTP_CODE_500_MESSAGE,
} = require("../utils/constants");
const { getOwnIdeas, getIdeas } = require("../idea/idea.service");
const middleware = {
  Query: {
    userProfile: [authenticated()],
    getOwnIdeas: [authenticated()],
    getFundedIdea: [authenticated()],
    getUserById: [requestValidator(getUserByIdValidator)],
  },
};

const userResolver = {
  Query: {
    userProfile: async (parent, args, ctx) => {
      const user = await getUserById(ctx.currentUser.id);
      return user;
    },
    getUserById: async (parent, args) => {
      const user = await getUserById(args.userId);
      return user;
    },
    getOwnIdeas: async (parent, args, ctx) => {
      try {
        console.log(ctx.currentUser);
        const ownIdea = await getIdeas({ owner: ctx.currentUser.id });

        return ownIdea;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    getFundedIdea: async (parent, args, ctx) => {
      try {
        const ownIdea = await getIdeas({ "fund.donor": ctx.currentUser.id });

        return ownIdea;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
  },

  User: userTypeRosolver,
};

module.exports = composeResolvers(userResolver, middleware);
