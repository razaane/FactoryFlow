const express = require("express");
const installationController = require("../controllers/installation.controller");

const router = express.Router();
router.get("/status",installationController.getStatus);

module.exports= router ;
