const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const API_SECRET = require("../config/config.json")["apiSecret"];

module.exports = function (userType = "user") {
  return async (req, res, next) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "JWT"
    ) {
      try {
        const decodedUser = await jwt.verify(
          req.headers.authorization.split(" ")[1],
          API_SECRET
        );
        
        if (decodedUser) {
          if(userType == "admin" && !decodedUser.isAdmin){
            next(createHttpError(401, "Unauthorized"));
          }
          req.user = decodedUser;
          next();
        }
      } catch (err) {
        req.user = undefined;
        next(createHttpError(401, err));
      }
    } else {
      next(createHttpError(401, "Unauthorized"));
    }
  };
};
