const {mergeResolvers} = require("@graphql-tools/merge")
const ideaResolvers = require('./../idea/idea.resolvers');
const authResolvers = require('./../auth/auth.resolvers');


module.exports = mergeResolvers (
   [ ideaResolvers, authResolvers ]
)