const userTypeDefs = `#graphql
    type UserFund {
        amount: Float
    }
   
    type User {
        id: ID!
        username: String!
        role: String!
        userFund: UserFund
    }
   
    
    type Query {
        getUser: User!
        userProfile: User!
        getUserById(userId: ID!): User!
        getOwnIdeas: [Idea]!
        getFundedIdea: [Idea]!
    }


    `;

module.exports = userTypeDefs;
