const express = require("express");
const router = express.Router();

const rawMaterialController = require("../controllers/rawMaterial.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.post("/",authenticate,authorize("Admin"),rawMaterialController.create);

module.exports = router;
