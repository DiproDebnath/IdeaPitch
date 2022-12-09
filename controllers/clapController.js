const createHttpError = require("http-errors");
const clapService = require("../services/clapService");

module.exports = {
  addClap: async (req, res) => {
   
    // checking claps. return 0 if don't find any
    const validateUserClap = await clapService.validateUserClap(req.user.id, req.body);
   
    if (!validateUserClap.success && validateUserClap.status != 401)
      throw createHttpError(validateUserClap.status, validateUserClap.message);
   
      
     const clapData = await clapService.addClap(validateUserClap, req.user.id, req.body);

     if (!clapData.success)
       throw createHttpError(clapData.status, clapData.message);

    res.json(clapData.data);

  },
  getUserClaps: async (req, res) => {
  
    const clapData = await clapService.getUserClaps(req.params.id, req.user.id);

    if (!clapData.success)
      throw createHttpError(clapData.status, clapData.message);

    res.json(clapData.data);
  }
};
