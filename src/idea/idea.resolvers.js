
const ideaResolvers = {
    Query: {
        getIdeas : async (parent, args, ctx)  => {
            return [{id: 1}]
        },
        getIdeabyId: async (parent, args, ctx) => {
            return "hello"
        }
    }

}

module.exports = ideaResolvers;

