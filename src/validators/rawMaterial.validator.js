const AppError = require("../utils/AppError");

function validateCreateMaterial(body = {}) {
  const { reference, name, unit, stockInitial, alertThreshold } = body;

  if (!reference || reference.length === 0) {
    throw new AppError("Référence obligatoire", 400);
  }

  if (!name || name.length < 2) {
    throw new AppError("Nom invalide", 400);
  }

  if (!unit || unit.length === 0) {
    throw new AppError("Unité obligatoire", 400);
  }

  if (typeof stockInitial !== "number" || stockInitial < 0) {
    throw new AppError("Stock initial invalide", 400);
  }

  if (
    alertThreshold !== undefined &&
    (typeof alertThreshold !== "number" || alertThreshold < 0)
  ) {
    throw new AppError("Seuil d'alerte invalide", 400);
  }
}

module.exports = { validateCreateMaterial };