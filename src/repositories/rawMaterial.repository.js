const RawMaterial = require("../models/rawMaterial.model");

async function create(data) {
  return RawMaterial.create(data);
}
async function findByReference(reference) {
  return RawMaterial.findOne({ reference });
}


module.exports = { create , findByReference};