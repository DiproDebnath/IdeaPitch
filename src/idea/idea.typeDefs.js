const ideaTypeDefs = `#graphql
    enum Status {
        APPROVED
        PENDING
        REJECTED
    }

    type IdeaFund {
        donor: User
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
        fund: [IdeaFund]
    
    }

    input createIdeaInput {
        title: String!
        description: String!
        thumbnail: String
        budget: Float!
    }
    input updateIdeaInput {
        id: ID!
        title: String
        description: String
        thumbnail: String
        budget: Float
    }
    input allIdeaFilter{
        page: Int
        perPage: Int
    }

    # Queries
    type Query {
        getIdeas(filter: allIdeaFilter): [Idea]!
        getIdeaById(id: ID!): Idea!
        getPublicIdeas(filter: allIdeaFilter): [Idea]!
        getPublicIdeaById(id: ID!): Idea!
        
    }
    # Mutation
    type Mutation {
        createIdea(createIdeaInput: createIdeaInput!) : Idea!
        updateIdea(updateIdeaInput: updateIdeaInput!) : Idea!
        deleteIdea(id: ID!) : Boolean!
        approveIdea(id: ID!) : Idea!
        rejectIdea(id: ID! note: String!) : Idea!
        sendFund(amount: Float! ideaId: ID!) : Idea!
        returnFund(ideaId: ID!) : Idea!
    }
    
    
    `;

module.exports = ideaTypeDefs;
