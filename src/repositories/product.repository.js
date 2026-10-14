const Product = require("../models/product.model");

async function create(data) {
  return Product.create(data);
}

async function findByReference(reference) {
  return Product.findOne({ reference });
}

module.exports = {
  create,
  findByReference
};