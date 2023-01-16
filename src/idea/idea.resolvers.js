const { composeResolvers } = require("@graphql-tools/resolvers-composition");

const {
  HTTP_CODE_500_MESSAGE,
  NOT_AUTHORIZED,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_CODE,
} = require("../utils/constants");

const {
  createIdea,
  checkSlug,
  validateIdeaAndOwner,
  updateIdea,
  deleteIdea,
} = require("./idea.service");
const throwError = require("../utils/errorHandler");

const { authenticated } = require("../middleware/auth.middleware");
const {
  createIdeaValidator,
  updateIdeaValidator,
} = require("./idea.validator");
const requestValidator = require("../middleware/resquestValidator");

const middleware = {
  Mutation: {
    createIdea: [authenticated(), requestValidator(createIdeaValidator)],
    updateIdea: [authenticated(), requestValidator(updateIdeaValidator)],
    deleteIdea: [authenticated()],
  },
};

const ideaResolvers = {
  Query: {
    getIdeas: async (_, args, ctx) => [{ id: 1 }],
    getIdeabyId: async (_, args, ctx) => "hello",
  },
  Mutation: {
    createIdea: async (parent, args, ctx) => {
      const { createIdeaInput } = args;
      try {
        const slugValidationRes = await checkSlug(createIdeaInput.title);
        const createIdeaData = {
          ...createIdeaInput,
          slug: slugValidationRes,
          owner: ctx.currentUser.id,
        };
        const createIdeaRes = await createIdea(createIdeaData);
        return createIdeaRes;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    updateIdea: async (parent, args, ctx) => {
      const updateIdeaData = {
        ...args.updateIdeaInput,
        owner: ctx.currentUser?.id,
      };
      try {
        const checkIdeaAndOwner = await validateIdeaAndOwner(updateIdeaData);

        if (!checkIdeaAndOwner) {
          return throwError(HTTP_CODE_401_CODE, NOT_AUTHORIZED);
        }

        const updateIdeaRes = await updateIdea(updateIdeaData);

        return updateIdeaRes;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    deleteIdea: async (parent, args, ctx) => {
      const deleteIdeaData = {
        id: args.id,
        owner: ctx.currentUser?.id,
      };
      try {
        const checkIdeaAndOwner = await validateIdeaAndOwner(deleteIdeaData);

        if (!checkIdeaAndOwner) {
          return throwError(HTTP_CODE_401_CODE, NOT_AUTHORIZED);
        }

        const deleteIdeaRes = await deleteIdea(deleteIdeaData.id);

        return deleteIdeaRes;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
  },
};

module.exports = composeResolvers(ideaResolvers, middleware);
