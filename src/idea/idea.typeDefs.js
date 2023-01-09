const ideaTypeDefs = `#graphql
    enum Status {
        APPROVED
        PENDING
        REJECTED
    }

    type ideaFund {
        user: User
        amount: Float
        isReturn: Boolean
    }

    type userClaps {
        user: User
        claps: Int!
    }

    type Idea {
        id: ID!
        title: String!
        slug: String!
        description: String
        thumbnail: String
        owner: User
        budget: Float
        status: Status
        note: String
        userClaps: userClaps
        totalFund: Float
        fund: ideaFund
    
    }


    # Queries
    type Query {
        getIdeas: [Idea!]
        getIdeabyId(id: ID!): Idea!
    }
    

    # Mutation

    # type Mutation {

    # }
    
    
    `;

module.exports = ideaTypeDefs;
