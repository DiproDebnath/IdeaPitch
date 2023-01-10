const {
  HTTP_CODE_422_CODE,
  HTTP_CODE_400_MESSAGE,
  HTTP_CODE_400_CODE,
  HTTP_CODE_500_MESSAGE,
  HTTP_CODE_422_MESSAGE,
  HTTP_CODE_500_CODE,
  USER_ALREADY_EXISTS,
} = require("../utils/constants");

const _promise = require("../utils/asyncWrapper");
const {createIdea, checkSlug} = require('./idea.service');
const throwError = require("../utils/errorHandler");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const requestValidator = require("../utils/resquestValidator");
const { authenticated } = require("../utils/auth");
const {
  createIdea: createIdeaValidator,
  
} = require("./idea.validator");

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
      const { createIdeaInput } = args;

      try {
        const [slugValidationErr, slugValidationRes] = await _promise(
          checkSlug(createIdeaInput.title)
        );

       
        if (slugValidationErr ) {
          console.log(slugValidationErr);
          return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);         
        }
        createIdeaInput.slug = slugValidationRes;
        createIdeaInput.owner = ctx.currentUser.id;
        

        const [createIdeaErr, createIdeaRes] = await _promise(
          createIdea(createIdeaInput)
        );

        if (createIdeaErr) {
          return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
        }

        return createIdeaRes;

      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
  },
};

const resolversComposition = {
  "Mutation.createIdea": [
    authenticated(),
    requestValidator(createIdeaValidator, "userAuthInput"),
  ],
};

const composedResolvers = composeResolvers(ideaResolvers, resolversComposition);

module.exports = composedResolvers;
