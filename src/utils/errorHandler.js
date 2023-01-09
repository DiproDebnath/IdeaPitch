const { GraphQLError } = require("graphql");

module.exports = (errorCode, errorMessage, validationError = null) => {
  return new GraphQLError(errorMessage, {
    extensions: { code: errorCode, validationError },
  });
};
