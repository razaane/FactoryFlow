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

  const validateUpdate =
  require("../validators/productionOrderUpdate.validator");



router.use(
  authenticate,
  authorize("Admin")
);

router.post(
  "/",
  validateCreate,
  controller.create
);

router.put(
  "/:id",
  validateUpdate,
  controller.update
);

router.post(
  "/:id/cancel",
  controller.cancel
);
module.exports = router;