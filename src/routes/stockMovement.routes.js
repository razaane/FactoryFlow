
const express = require("express");

const router = express.Router();

const controller = require("../controllers/stockMovement.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { validateListMovements } =
  require("../validators/stockMovement.validator");

router.use(authenticate, authorize("Admin"));

router.get("/", validateListMovements, controller.list);

module.exports = router;