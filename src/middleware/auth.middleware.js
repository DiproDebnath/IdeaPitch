const {
  HTTP_CODE_401_MESSAGE,
  HTTP_CODE_401_CODE,
  NOT_AUTHORIZED,
} = require("../utils/constants");

const throwError = require("../utils/errorHandler");

module.exports.authenticated = () => (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    return throwError(HTTP_CODE_401_CODE, HTTP_CODE_401_MESSAGE);
  }
  return next(root, args, ctx, info);
};

module.exports.hasRole = (userRole) => (next) => (root, args, ctx, info) => {
  if (ctx.currentUser.role !== userRole) {
    return throwError(HTTP_CODE_401_CODE, NOT_AUTHORIZED);
  }
  return next(root, args, ctx, info);
};
