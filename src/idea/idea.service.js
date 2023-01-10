const { default: slugify } = require("slugify");
const Idea = require("./idea.model");

const ideaService = {
  handleFileUpload: async (file) => {
    const thumbnail = Date.now().toString() + "_" + file.name;

    await file.mv("./uploads/" + thumbnail);
    return thumbnail;
  },
  checkSlug: async (title) => {
    let slug = slugify(title, {
      remove: "/[*+~.()'\"!:@]/g",
      lower: true,
    });
    const regx = new RegExp('^' + slug , 'i')
    
    const idea = await Idea.count({
      slug: regx,
    });

    slug = idea ? slug + `-${idea}` : slug;

    return slug;
  },
  createIdea: async (payload) => {
    const idea = await Idea.create(payload);
    return idea
  }
};

module.exports = ideaService;
