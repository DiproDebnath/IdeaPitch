const express = require("express");
const router = express.Router();
const middleware = require("../middlewares");
const authController = require("../controllers/authController");
const { captureError } = require("../utils/helper");


router.post(
  "/signup",
  middleware.requestValidator("auth", "aunthentication"),
  captureError(authController.signUp)
);

router.post(
    "/signin",
    middleware.requestValidator("auth", "aunthentication"),
    captureError(authController.signIn)
  );

module.exports = router;
