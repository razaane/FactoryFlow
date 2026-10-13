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

  if (typeof stockInitial !== "number" || stockInitial < 0 ) {
    throw new AppError("Stock initial invalide", 400);
  }

  if (
    alertThreshold !== undefined &&
    (typeof alertThreshold !== "number" || alertThreshold < 0 )
  ) {
    throw new AppError("Seuil d'alerte invalide", 400);
  }
}
function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Identifiant invalide", 400);
  }
}

function validateListQuery(query = {}) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("Page invalide", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("Limit invalide", 400);
  }

  return { page, limit };
}

function validateUpdateMaterial(body = {}) {
  const { reference, name, unit, alertThreshold } = body;

  if (body.quantity !== undefined || body.stockInitial !== undefined) {
    throw new AppError("Le stock se modifie uniquement par les mouvements", 400);
  }

  if (
    reference !== undefined &&
    (typeof reference !== "string" || !reference.trim())
  ) {
    throw new AppError("Référence invalide", 400);
  }

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length < 2)
  ) {
    throw new AppError("Nom invalide", 400);
  }

  if (unit !== undefined && (typeof unit !== "string" || !unit.trim())) {
    throw new AppError("Unité invalide", 400);
  }

  if (
    alertThreshold !== undefined &&
    (typeof alertThreshold !== "number" ||
      !Number.isFinite(alertThreshold) ||
      alertThreshold < 0)
  ) {
    throw new AppError("Seuil invalide", 400);
  }

  if (
    [reference, name, unit, alertThreshold].every(v => v === undefined)
  ) {
    throw new AppError("Aucun champ à modifier", 400);
  }
}

module.exports = {
  validateCreateMaterial,
  validateId,
  validateListQuery,
  validateUpdateMaterial
};