
function validateListMovements(req, res, next) {
  try {
    const { page, limit, type, from, to, material } = req.query;

    if (
      page !== undefined &&
      (!/^\d+$/.test(page) || Number(page) < 1)
    ) {
      const error = new Error("page invalide");
      error.statusCode = 400;
      throw error;
    }

    if (
      limit !== undefined &&
      (!/^\d+$/.test(limit) ||
        Number(limit) < 1 ||
        Number(limit) > 100)
    ) {
      const error = new Error("limit doit être compris entre 1 et 100");
      error.statusCode = 400;
      throw error;
    }

    if (type && !["ENTREE", "SORTIE"].includes(type)) {
      const error = new Error("type invalide");
      error.statusCode = 400;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validateListMovements };