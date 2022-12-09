const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const clapController = require("../controllers/clapController");
const { captureError } = require("../utils/helper");


router.post(
  "/",
  middleware.verifyAuth(),
  middleware.requestValidator("clap", "addClap"),
  captureError(clapController.addClap)
);



// router.get(
//   "/idea/:id/getclap",
//   middleware.verifyAuth(),
//   captureError(ideaController.getAllIdeas)
// );


module.exports = router;
