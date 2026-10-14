
const RawMaterial = require("../models/rawMaterial.model");
const stockMovementRepository = require("../repositories/stockMovement.repository");

async function addEntry(materialId, quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error("La quantité doit être strictement positive");
    error.statusCode = 400;
    throw error;
  }

  const material = await RawMaterial.findById(materialId);

  if (!material) {
    const error = new Error("Matière première introuvable");
    error.statusCode = 404;
    throw error;
  }

  return stockMovementRepository.create({
    matiere: material._id,
    type: "ENTREE",
    quantite: quantity
  });
}

module.exports = { addEntry };