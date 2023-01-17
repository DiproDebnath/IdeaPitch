const { composeResolvers } = require("@graphql-tools/resolvers-composition");

const {
  HTTP_CODE_500_MESSAGE,
  NOT_AUTHORIZED,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_CODE,
  role,
  HTTP_CODE_404_CODE,
  HTTP_CODE_404_MESSAGE,
} = require("../utils/constants");
const { status } = require("./idea.enum");
const {
  createIdea,
  checkSlug,
  validateIdeaAndOwner,
  updateIdea,
  deleteIdea,
  getIdeas,
  validateIdea,
  approveIdea,
  rejectIdea,
} = require("./idea.service");
const throwError = require("../utils/errorHandler");

const { authenticated, hasRole } = require("../middleware/auth.middleware");
const {
  createIdeaValidator,
  updateIdeaValidator,
  approveIdeaValidator,
  rejectIdeaValidator,
} = require("./idea.validator");
const requestValidator = require("../middleware/resquestValidator");
const ideaTypeRosolver = require("./idea.typeResolver");

const middleware = {
  Query: {
    getIdeas: [authenticated(), hasRole(role.ADMIN)],
    getIdeaById: [authenticated(), hasRole(role.ADMIN)],
  },
  Mutation: {
    approveIdea: [
      authenticated(),
      hasRole(role.ADMIN),
      requestValidator(approveIdeaValidator),
    ],
    rejectIdea: [
      authenticated(),
      hasRole(role.ADMIN),
      requestValidator(rejectIdeaValidator),
    ],
    createIdea: [authenticated(), requestValidator(createIdeaValidator)],
    updateIdea: [authenticated(), requestValidator(updateIdeaValidator)],
    deleteIdea: [authenticated()],
  },
};

const ideaResolvers = {
  Query: {
    // public resolver
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

    // public resolver
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

    // admin resolver
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

    // admin resolver
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
    // admin resolver
    approveIdea: async (parent, args) => {
      try {
        const validateIdeaData = await validateIdea(args.id);

        if (!validateIdeaData)
          return throwError(HTTP_CODE_404_CODE, HTTP_CODE_404_MESSAGE);

        const approvedIdeaRes = await approveIdea({
          id: args.id,
          status: status.APPROVED,
        });

        return approvedIdeaRes.toJSON();
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    // admin resolver
    rejectIdea: async (parent, args) => {
      try {
        const validateIdeaData = await validateIdea(args.id);

        if (!validateIdeaData)
          return throwError(HTTP_CODE_404_CODE, HTTP_CODE_404_MESSAGE);

        const rejectedIdeaRes = await rejectIdea({
          id: args.id,
          status: status.REJECTED,
          note: args?.note,
        });

        return rejectedIdeaRes.toJSON();
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    // member resolver
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
    // member resolver
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
    // member resolver
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
