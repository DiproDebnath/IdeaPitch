const {mergeTypeDefs} = require("@graphql-tools/merge");
const ideaTypeDefs = require('../idea/idea.typeDefs');
const userTypeDefs = require('../user/user.typeDefs');
 


module.exports = mergeTypeDefs( [ideaTypeDefs, userTypeDefs] )