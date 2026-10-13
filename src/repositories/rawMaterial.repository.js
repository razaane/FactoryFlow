
const RawMaterial = require("../models/rawMaterial.model");

async function create(data) {
  return RawMaterial.create(data);
}

async function findByReference(reference) {
  return RawMaterial.findOne({ reference });
}

async function findById(id) {
  return RawMaterial.findById(id);
}

async function findAll(skip, limit) {
  return RawMaterial.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function count() {
  return RawMaterial.countDocuments();
}

async function updateById(id, data) {
  return RawMaterial.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
}

module.exports = {
  create,
  findByReference,
  findById,
  findAll,
  count,
  updateById
};