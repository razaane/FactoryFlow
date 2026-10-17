const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/operatorOrder.controller");

const authenticate =
  require("../middlewares/authenticate");

const authorize =
  require("../middlewares/authorize");

const validateList =
  require("../validators/operatorOrderList.validator");

router.use(
  authenticate,
  authorize("Operateur")
);

router.get(
  "/",
  validateList,
  controller.list
);

router.get(
  "/:id",
  controller.getById
);


router.get("/history", controller.history);
router.post("/:id/start", controller.start);
router.post("/:id/finish", controller.finish);

module.exports = router;