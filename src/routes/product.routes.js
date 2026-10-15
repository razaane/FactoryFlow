
const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const validateProduct = require("../validators/product.validator");
const validateProductList = require("../validators/productList.validator");
const validateProductId = require("../validators/productId.validator");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.use(authenticate, authorize("Admin"));

router.post("/", validateProduct, controller.create);

router.get("/", validateProductList, controller.list);

router.get("/:id", validateProductId, controller.getById);

module.exports = router;
