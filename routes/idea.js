const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const ideaController = require("../controllers/ideaController");
const { captureError } = require("../utils/helper");


router.post(
  "/create",
  middleware.verifyAuth,
  middleware.requestValidator("idea", "createIdea"),
  captureError(ideaController.createIdea)
);


// router.post(
//     "/signin",
//     middleware.requestValidator("auth", "aunthentication"),
//     captureError(authController.signIn)
//   );

module.exports = router;
