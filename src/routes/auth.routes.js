const express = require("express");
const authController = require("../controllers/auth.controller");
const authenticate =require("../middlewares/authenticate");
const router = express.Router();

router.post("/login", authController.login);
router.get( "/me", authenticate, authController.getProfile );
module.exports = router;
