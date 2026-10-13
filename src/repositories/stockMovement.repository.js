const StockMovement = require("../models/stockMovement.model");

async function create(data) {
  return StockMovement.create(data);
}

module.exports = { create };