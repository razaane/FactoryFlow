
const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const validateProduct = require("../validators/product.validator");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.use(authenticate, authorize("Admin"));
router.post("/", validateProduct, controller.create);
module.exports = router;