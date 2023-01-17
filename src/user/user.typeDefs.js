const userTypeDefs = `#graphql
    type UserFund {
        amount: Float
    }
   
    type User {
        username: String!
        role: String!
        userFund: UserFund
    }
   
    
    type Query {
        getUser: User!
    }


    `;

module.exports = userTypeDefs;
