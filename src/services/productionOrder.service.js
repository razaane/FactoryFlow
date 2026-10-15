const mongoose = require("mongoose");

const AppError = require("../utils/AppError");

const Product = require("../models/product.model");
const User = require("../models/user.model");

const productionOrderRepository =
  require("../repositories/productionOrder.repository");

async function create({
  productId,
  quantity,
  assignedTo,
  createdBy
}) {
  // 1. Vérifier quantity
  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new AppError(
      "La quantité doit être strictement positive",
      400
    );
  }

  // 2. Vérifier Product ID
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError(
      "Identifiant produit invalide",
      400
    );
  }

  // 3. Vérifier assignedTo ID
  if (!mongoose.isValidObjectId(assignedTo)) {
    throw new AppError(
      "Identifiant opérateur invalide",
      400
    );
  }

  // 4. Chercher le produit
  const product = await Product.findById(productId)
    .lean();

  if (!product) {
    throw new AppError(
      "Produit introuvable",
      404
    );
  }

  // 5. Chercher l'opérateur
  const operator = await User.findById(assignedTo)
    .lean();

  if (!operator) {
    throw new AppError(
      "Utilisateur introuvable",
      404
    );
  }

  // 6. Vérifier rôle
  if (operator.role !== "Operateur") {
    throw new AppError(
      "L'utilisateur affecté doit être un opérateur",
      400
    );
  }

  // 7. Copier composition
  const composition = product.composition.map(
    item => ({
      material: item.material,
      quantity: item.quantity
    })
  );

  // 8. Générer référence
  const reference = `OF-${Date.now()}`;

  // 9. Créer ordre
  try {
    return await productionOrderRepository.create({
      reference,
      product: product._id,
      quantity,
      composition,
      status: "PLANIFIE",
      assignedTo: operator._id,
      createdBy
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "La référence de l'ordre existe déjà",
        409
      );
    }

    throw error;
  }
}

module.exports = {
  create
};