const authTypeDefs = `#graphql
    input userAuthInput {
        username: String!
        password: String!
    }

    type AuthReturn{
        username: String!
        role: String!
        accessToken: String
    }

    

    # Mutation
    type Mutation {
        signUp(userAuthInput:  userAuthInput!) : AuthReturn!
        signIn(userAuthInput: userAuthInput!) : AuthReturn!
    }
    `;

module.exports = authTypeDefs;
