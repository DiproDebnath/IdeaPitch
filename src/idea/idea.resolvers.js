/* eslint-disable eqeqeq */
const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const moment = require("moment");

const {
  HTTP_CODE_500_MESSAGE,
  NOT_AUTHORIZED,
  HTTP_CODE_500_CODE,
  HTTP_CODE_401_CODE,
  role,
  HTTP_CODE_404_CODE,
  HTTP_CODE_404_MESSAGE,
  HTTP_CODE_400_CODE,
  RESTRICT_FUND_TO_OWN_IDEA,
  ALREADY_FUNDED,
  NOT_ENOUGH_FUND,
  REFUND_PERIOD_EXPIRED,
  HTTP_CODE_400_MESSAGE,
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
  sendFund,
  returnFund,
} = require("./idea.service");
const throwError = require("../utils/errorHandler");

const { authenticated, hasRole } = require("../middleware/auth.middleware");
const {
  createIdeaValidator,
  updateIdeaValidator,
  approveIdeaValidator,
  rejectIdeaValidator,
  sendIdeaFundValidator,
  returnIdeaFundValidator,
} = require("./idea.validator");
const requestValidator = require("../middleware/resquestValidator");
const { ideaTypeRosolver, ideaFundResolver } = require("./idea.typeResolver");
const { getUserById } = require("../user/user.service");

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
    sendFund: [
      authenticated(),
      hasRole(role.MEMBER),
      requestValidator(sendIdeaFundValidator),
    ],
    returnFund: [
      authenticated(),
      hasRole(role.MEMBER),
      requestValidator(returnIdeaFundValidator),
    ],
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
        const ideas = await getIdeas(filter);
        console.log(ideas);
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
        const ideas = await getIdeas(filter, {}, true);

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

        const ideas = await getIdeas(filter);

        return ideas;
      } catch (err) {
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },

    // admin resolver
    getIdeaById: async (_, args) => {
      try {
        const ideas = await getIdeas({ id: args.id }, {}, true);

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

        return approvedIdeaRes;
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

        return rejectedIdeaRes;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    // member resolver
    sendFund: async (parent, args, ctx) => {
      const { id: userId } = ctx.currentUser;
      const { amount, ideaId } = args;
      try {
        const validateIdeaRes = await getIdeas({ id: ideaId }, {}, true);

        if (!validateIdeaRes) {
          return throwError(HTTP_CODE_404_CODE, HTTP_CODE_404_MESSAGE);
        }
        if (validateIdeaRes?.owner == userId) {
          return throwError(HTTP_CODE_400_CODE, RESTRICT_FUND_TO_OWN_IDEA);
        }
        const ideaFund = validateIdeaRes.fund.find(
          (f) => f.donor == userId && f.isReturn == false
        );

        if (ideaFund && !ideaFund.isReturn) {
          return throwError(HTTP_CODE_400_CODE, ALREADY_FUNDED);
        }

        const user = await getUserById(userId);

        if (amount > user.userFund.amount) {
          return throwError(HTTP_CODE_400_CODE, NOT_ENOUGH_FUND);
        }
        const userFundLeft = Number(user.userFund.amount) - Number(amount);
        const totalFund = Number(validateIdeaRes.totalFund) + Number(amount);

        const fundedIdea = await sendFund(
          ideaId,
          userId,
          amount,
          userFundLeft,
          totalFund
        );
        return fundedIdea;
      } catch (err) {
        console.log(err);
        return throwError(HTTP_CODE_500_CODE, HTTP_CODE_500_MESSAGE);
      }
    },
    returnFund: async (parent, args, ctx) => {
      const { id: userId } = ctx.currentUser;
      const { ideaId } = args;
      try {
        const validateIdeaRes = await getIdeas({ id: ideaId }, {}, true);

        const ideaFund = validateIdeaRes.fund.find((f) => f.donor == userId);

        if (ideaFund.isReturn) {
          return throwError(HTTP_CODE_400_CODE, HTTP_CODE_400_MESSAGE);
        }
        const x = moment(ideaFund.createdAt);
        const y = moment();
        const diff = y.diff(x, "days");

        if (diff > 7) {
          return throwError(HTTP_CODE_400_CODE, REFUND_PERIOD_EXPIRED);
        }

        const payload = {
          id: ideaId,
          userId,
          ideaFund,
        };
        const idea = await returnFund(payload);

        return idea;
      } catch (err) {
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
  IdeaFund: ideaFundResolver,
};

module.exports = composeResolvers(ideaResolvers, middleware);
