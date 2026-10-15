const AppError = require("../utils/AppError");

function validateOperatorOrderList(
  req,
  res,
  next
) {
  const {
    status,
    page = "1",
    limit = "10"
  } = req.query;

  const allowedStatuses = [
    "PLANIFIE",
    "EN_COURS",
    "TERMINE",
    "ANNULE"
  ];

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const errors = [];

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
  validateOperatorOrderList;