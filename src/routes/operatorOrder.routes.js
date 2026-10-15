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

module.exports = router;