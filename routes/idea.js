const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const ideaController = require("../controllers/ideaController");
const { captureError } = require("../utils/helper");


router.post(
  "/create",
  middleware.verifyAuth(),
  middleware.requestValidator("idea", "createIdea"),
  captureError(ideaController.createIdea)
);



// router.get(
//   "/user/idea",
//   middleware.verifyAuth(),
//   captureError(ideaController.getAllIdeas)
// );


// public api

router.get(
  "/",
  captureError(ideaController.getAllIdeas)
);

router.get(
  "/:id",
  captureError(ideaController.getIdeaById)
);




module.exports = router;
