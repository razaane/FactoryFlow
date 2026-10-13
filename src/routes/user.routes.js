const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.post("/", authenticate, authorize("Admin"), userController.create);
router.get("/", authenticate, authorize("Admin"), userController.list);

module.exports = router;