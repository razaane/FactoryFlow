const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/productionOrder.controller");

const authenticate =
  require("../middlewares/authenticate");

const authorize =
  require("../middlewares/authorize");

const validateCreate =
  require("../validators/productionOrder.validator");

router.use(
  authenticate,
  authorize("Admin")
);

router.post(
  "/",
  validateCreate,
  controller.create
);

module.exports = router;