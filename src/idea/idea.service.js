const ideaService = {
  handleFileUpload: async (file) => {
    const thumbnail = Date.now().toString() + "_" + file.name;

    await file.mv("./uploads/" + thumbnail);
    return thumbnail
  },
};

module.exports = ideaService
