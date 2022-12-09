const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const clapController = require("../controllers/clapController");
const { captureError } = require("../utils/helper");





router.get(
  "/idea/:id/getclap",
  middleware.verifyAuth(),
  captureError(clapController.getUserClaps)
);


module.exports = router;
