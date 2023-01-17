const { composeResolvers } = require("@graphql-tools/resolvers-composition");
const userTypeRosolver = require("./user.typeResolver");

const middleware = {};

const userResolver = {
  User: userTypeRosolver,
};

module.exports = composeResolvers(userResolver, middleware);
