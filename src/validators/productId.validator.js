
const mongoose = require("mongoose");

function validateProductId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const error = new Error("Identifiant produit invalide");
    error.statusCode = 400;
    return next(error);
  }

  next();
}

module.exports = validateProductId;
