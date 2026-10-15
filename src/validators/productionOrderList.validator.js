const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

function validateProductionOrderList(
  req,
  res,
  next
) {
  const {
    status,
    product,
    from,
    to,
    page = "1",
    limit = "10"
  } = req.query;

  const errors = [];

  const allowedStatuses = [
    "PLANIFIE",
    "EN_COURS",
    "TERMINE",
    "ANNULE"
  ];

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1
  ) {
    errors.push(
      "page doit être un entier >= 1"
    );
  }

  if (
    !Number.isInteger(limitNumber) ||
    limitNumber < 1 ||
    limitNumber > 100
  ) {
    errors.push(
      "limit doit être compris entre 1 et 100"
    );
  }

  if (
    status &&
    !allowedStatuses.includes(status)
  ) {
    errors.push("Statut invalide");
  }

  if (
    product &&
    !mongoose.isValidObjectId(product)
  ) {
    errors.push(
      "Identifiant produit invalide"
    );
  }

  if (from && Number.isNaN(Date.parse(from))) {
    errors.push(
      "Date from invalide"
    );
  }

  if (to && Number.isNaN(Date.parse(to))) {
    errors.push(
      "Date to invalide"
    );
  }

  if (
    from &&
    to &&
    new Date(from) > new Date(to)
  ) {
    errors.push(
      "from doit être antérieure ou égale à to"
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

  req.pagination = {
    page: pageNumber,
    limit: limitNumber
  };

  next();
}

module.exports =
  validateProductionOrderList;