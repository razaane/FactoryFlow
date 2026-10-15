const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

function validateProductionOrderUpdate(
  req,
  res,
  next
) {
  const {
    quantity,
    assignedTo
  } = req.body;

  const errors = [];

  if (
    quantity === undefined &&
    assignedTo === undefined
  ) {
    errors.push(
      "Au moins quantity ou assignedTo est requis"
    );
  }

  if (
    quantity !== undefined &&
    (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    )
  ) {
    errors.push(
      "La quantité doit être strictement positive"
    );
  }

  if (
    assignedTo !== undefined &&
    (
      typeof assignedTo !== "string" ||
      !mongoose.isValidObjectId(assignedTo)
    )
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

module.exports =
  validateProductionOrderUpdate;