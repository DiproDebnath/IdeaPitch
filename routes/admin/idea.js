const express = require("express");
const router = express.Router();
const middleware = require("../../middlewares");
const adminIdeaController = require("../../controllers/admin/ideaController");
const { captureError } = require("../../utils/helper");


router.get(
  "/",
  captureError(adminIdeaController.getAllIdeas)
);
router.get(
  "/:id",
  captureError(adminIdeaController.getIdeaById)
);
router.get(
  "/:id/approve",
  captureError(adminIdeaController.approveIdea)
);

router.post(
  "/:id/reject",
  middleware.requestValidator("idea", "reject"),
  captureError(adminIdeaController.rejectIdea)
);




module.exports = router;
