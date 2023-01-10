const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_400_MESSAGE,
  HTTP_CODE_400_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
  USER_ALREADY_EXISTS,
} = require("../utils/constants");

const throwError = require("../utils/errorHandler");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const {authenticated} = require('../utils/auth');
const _promise = require("../utils/asyncWrapper");

const requestValidator = require("../utils/resquestValidator");
const {createIdea:createIdeaValidator} = require("./idea.validator");

const ideaResolvers = {
  Query: {
    getIdeas: async (parent, args, ctx) => {
      return [{ id: 1 }];
    },
    getIdeabyId: async (parent, args, ctx) => {
      return "hello";
    },
  },
  Mutation: {
    createIdea: async (parent, args, ctx) => {
      return {id: 12, title: "adsfa"}
    }
  }
};



const resolversComposition = {
    "Mutation.createIdea": [authenticated(), requestValidator(createIdeaValidator, "userAuthInput")],
  };



const composedResolvers = composeResolvers(ideaResolvers, resolversComposition)


module.exports = composedResolvers;
