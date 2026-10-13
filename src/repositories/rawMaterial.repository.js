const RawMaterial = require("../models/rawMaterial.model");

async function create(data) {
  return RawMaterial.create(data);
}



module.exports = { create };