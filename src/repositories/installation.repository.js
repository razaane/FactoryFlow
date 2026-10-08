const Installation = require("../models/installation.model");

async function find() {
  return Installation.findOne();
}

module.exports = { find };