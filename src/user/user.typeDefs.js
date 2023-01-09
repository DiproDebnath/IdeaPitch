const userTypeDefs = `#graphql
    type User {
        username: String!
        role: String!
        userFund: String
    }
    
    type Query {
        getUser: User!
    }


    `;

module.exports = userTypeDefs;
