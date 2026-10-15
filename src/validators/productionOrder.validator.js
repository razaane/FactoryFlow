const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

function validateProductionOrderCreate(
  req,
  res,
  next
) {
  const {
    product,
    quantity,
    assignedTo
  } = req.body;

  const errors = [];

  if (
    typeof product !== "string" ||
    !mongoose.isValidObjectId(product)
  ) {
    errors.push("Identifiant produit invalide");
  }

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    errors.push(
      "La quantité doit être strictement positive"
    );
  }

  if (
    typeof assignedTo !== "string" ||
    !mongoose.isValidObjectId(assignedTo)
  ) {
    errors.push(
      "Identifiant opérateur invalide"
    );
  }

  if (errors.length > 0) {
    return next(
      new AppError(
        errors.join(", "),
        400
      )
    );
  }

  next();
}

module.exports = validateProductionOrderCreate;