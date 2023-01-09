const {mergeTypeDefs} = require("@graphql-tools/merge");
const ideaTypeDefs = require('../idea/idea.typeDefs');
const userTypeDefs = require('../user/user.typeDefs');
const authTypeDefs = require('../auth/auth.typeDefs');
 


module.exports = mergeTypeDefs( [ideaTypeDefs, userTypeDefs, authTypeDefs] )