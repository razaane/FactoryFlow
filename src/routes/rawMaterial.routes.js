
const express = require("express");
const router = express.Router();

const controller = require("../controllers/rawMaterial.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.use(authenticate, authorize("Admin"));

router.post("/", controller.create);
router.get("/", controller.list);

router.get("/alerts", controller.getAlerts);

router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.post("/:id/stock-entries", controller.addStockEntry);

module.exports = router;