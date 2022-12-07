const createHttpError = require("http-errors");
const authService = require("../services/authService");

module.exports = {
  signIn: async (req, res) => {
    const authData = await authService.signIn(req.body);

    if (!authData.success)
      throw createHttpError(authData.status, authData.message);

    const { id, username, isAdmin } = authData.data;
    const token = authService.generateToken(id, username, isAdmin);
    authData.data.accessToken = token;
 
    res.json(authData.data);
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
