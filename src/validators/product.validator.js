
const mongoose = require("mongoose");

function validateProduct(req, res, next) {
  const { reference, name, composition } = req.body;

  const errors = [];

  if (typeof reference !== "string" || !reference.trim()) {
    errors.push("La référence est obligatoire");
  }

  if (typeof name !== "string" || !name.trim()) {
    errors.push("Le nom est obligatoire");
  }

  if (!Array.isArray(composition) || composition.length === 0) {
    errors.push("La composition doit contenir au moins une matière");
  } else {
    const seenMaterials = new Set();

    composition.forEach((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        errors.push(`Composition ${index + 1} invalide`);
        return;
      }

      if (
        typeof item.material !== "string" ||
        !mongoose.isValidObjectId(item.material)
      ) {
        errors.push(`Identifiant invalide pour la matière ${index + 1}`);
      } else {
        if (seenMaterials.has(item.material)) {
          errors.push(`Matière dupliquée : ${item.material}`);
        }

        seenMaterials.add(item.material);
      }

      if (
        typeof item.quantity !== "number" ||
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0
      ) {
        errors.push(
          `La quantité de la matière ${index + 1} doit être positive`
        );
      }
    });
  }

  if (errors.length > 0) {
    const error = new Error("Données du produit invalides");
    error.statusCode = 400;
    error.details = errors;
    return next(error);
  }

  next();
}



function validateProductList(req, res, next) {
  const { page, limit, search } = req.query;

  const isPositiveInteger = value =>
    /^\d+$/.test(value) && Number(value) > 0;

  if (page !== undefined && !isPositiveInteger(page)) {
    const error = new Error("page doit être un entier positif");
    error.statusCode = 400;
    return next(error);
  }

  if (limit !== undefined && !isPositiveInteger(limit)) {
    const error = new Error("limit doit être un entier positif");
    error.statusCode = 400;
    return next(error);
  }

  if (limit !== undefined && Number(limit) > 100) {
    const error = new Error("limit ne peut pas dépasser 100");
    error.statusCode = 400;
    return next(error);
  }

  if (search !== undefined && typeof search !== "string") {
    const error = new Error("search doit être une chaîne de caractères");
    error.statusCode = 400;
    return next(error);
  }

  next();
}


module.exports = {validateProduct,validateProductList};