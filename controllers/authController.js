const createHttpError = require("http-errors");
const authService = require("../services/authService");

module.exports = {
  signIn: async (req, res) => {
    const authData = await authService.signIn(req.body);

    if (!authData.success)
      throw createHttpError(authData.status, authData.message);

    const { id, username, isAdmin } = authData.data;
    const token = authService.generateToken(id, username, isAdmin, "10m");
    const refreshToken = authService.generateToken(id, username, isAdmin, "30d", true);
    authData.data.accessToken = token;
    authData.data.refreshToken = refreshToken;
 
    res.json(authData.data);
  },

  getRefreshToken: async(req, res) => {
    
    const refreshValidation =  await authService.verifyRefreshToken(req.body.refreshToken);

    if (!refreshValidation.success)
      throw createHttpError(refreshValidation.status, refreshValidation.message);

      const {tokenDetails} = refreshValidation
      console.log(tokenDetails);
      const token = authService.generateToken(tokenDetails.id, tokenDetails.username, tokenDetails.isAdmin, "10m", true);

      res.json({
        success: true,
        accessToken: token
      })

  },
  signUp: async (req, res) => {
    const validationData = await authService.checkUserExist(req.body);

    if (!validationData.success)
      throw createHttpError(validationData.status, validationData.message);

    const authData = await authService.signUp(req.body);

    if (!authData.success)
      throw createHttpError(authData.status, authData.message);

    const { id, username, isAdmin } = authData.data;
    const token = authService.generateToken(id, username, isAdmin);
    authData.data.accessToken = token;

    res.json(authData.data);
  },
};
