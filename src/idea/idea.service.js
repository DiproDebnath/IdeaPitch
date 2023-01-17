const { default: slugify } = require("slugify");
const { status } = require("./idea.enum");
const Idea = require("./idea.model");

const { PENDING } = status;
const ideaService = {
  getIdeas: async (
    { page = 1, perPage = 10, ...restArgs },
    select = {},
    single = false
  ) => {
    const skip = perPage * (page - 1);

    if (single) {
      const idea = Idea.findOne({ _id: restArgs.id }, select);
      return idea;
    }
    const ideas = Idea.find(restArgs, select)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: 1 });

    return ideas;
  },

  handleFileUpload: async (file) => {
    const thumbnail = `${Date.now().toString()}_${file.name}`;

    await file.mv(`./uploads/${thumbnail}`);
    return thumbnail;
  },
  checkSlug: async (title) => {
    let slug = slugify(title, {
      remove: "/[*+~.()'\"!:@]/g",
      lower: true,
    });
    const regx = new RegExp(`^${slug}`, "i");

    const idea = await Idea.count({
      slug: regx,
    });

    slug = idea ? `${slug}-${idea}` : slug;

    return slug;
  },
  createIdea: async (payload) => {
    const idea = await Idea.create(payload);
    return idea;
  },
  updateIdea: async ({ id, ...args }) => {
    const idea = await Idea.findOneAndUpdate({ _id: id }, args, { new: true });
    return idea;
  },
  deleteIdea: async (id) => {
    await Idea.deleteOne({ _id: id });

    return true;
  },
  validateIdeaAndOwner: async (payload, select = {}) => {
    const idea = await Idea.findOne(
      { _id: payload.id, owner: payload.owner, status: PENDING },
      select
    );

    if (!idea) {
      return false;
    }

    return idea;
  },
};

module.exports = ideaService;
