const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const clapController = require("../controllers/clapController");
const userController = require("../controllers/userController");
const { captureError } = require("../utils/helper");



router.get(
  "/idea/own_idea",
  middleware.verifyAuth(),
  captureError(userController.getOwnIdea)
);

router.get(
  "/idea/funded_idea",
  middleware.verifyAuth(),
  captureError(userController.getFundedIdea)
);


router.get(
  "/idea/:id/getclap",
  middleware.verifyAuth(),
  captureError(clapController.getUserClaps)
);

router.get(
  "/idea/:id",
  middleware.verifyAuth(),
  captureError(userController.getOwnIdeaById)
);

// public

router.get(
  "/:id",
  captureError(userController.getUserById)
);

module.exports = router;
