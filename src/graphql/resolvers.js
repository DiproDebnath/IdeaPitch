const {mergeResolvers} = require("@graphql-tools/merge")
const ideaResolvers = require('./../idea/idea.resolvers');


module.exports = mergeResolvers (
    ideaResolvers,
)