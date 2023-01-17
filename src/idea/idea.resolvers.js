const { composeResolvers } = require("@graphql-tools/resolvers-composition");

const {
  HTTP_CODE_500_MESSAGE,
  NOT_AUTHORIZED,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_CODE,
  role,
} = require("../utils/constants");
const { status } = require("./idea.enum");
const {
  createIdea,
  checkSlug,
  validateIdeaAndOwner,
  updateIdea,
  deleteIdea,
  getIdeas,
} = require("./idea.service");
const throwError = require("../utils/errorHandler");

const { authenticated, hasRole } = require("../middleware/auth.middleware");
const {
  createIdeaValidator,
  updateIdeaValidator,
} = require("./idea.validator");
const requestValidator = require("../middleware/resquestValidator");
const ideaTypeRosolver = require("./idea.typeResolver");

const middleware = {
  Query: {
    getIdeas: [authenticated(), hasRole(role.ADMIN)],
    getIdeaById: [authenticated(), hasRole(role.ADMIN)],
  },
  Mutation: {
    createIdea: [authenticated(), requestValidator(createIdeaValidator)],
    updateIdea: [authenticated(), requestValidator(updateIdeaValidator)],
    deleteIdea: [authenticated()],
  },
};

const ideaResolvers = {
  Query: {
    getPublicIdeas: async (_, args) => {
      try {
        const filter = {
          ...args.filter,
          status: status.APPROVED,
        };
        const ideas = getIdeas(filter);

        return ideas;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    getPublicIdeaById: async (_, args) => {
      try {
        const filter = {
          id: args.id,
          status: status.APPROVED,
        };
        const ideas = getIdeas(filter, {}, true);

        return ideas;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    getIdeas: async (_, args) => {
      try {
        const filter = {
          ...args?.filter,
        };

        const ideas = getIdeas(filter);

        return ideas;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    getIdeaById: async (_, args) => {
      try {
        const ideas = getIdeas({ id: args.id }, {}, true);

        return ideas;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
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
  Idea: ideaTypeRosolver,
};

module.exports = composeResolvers(ideaResolvers, middleware);
