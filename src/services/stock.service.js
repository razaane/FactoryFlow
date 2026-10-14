
const RawMaterial = require("../models/rawMaterial.model");
const stockMovementRepository = require("../repositories/stockMovement.repository");

async function addEntry(materialId, quantity) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error("La quantité doit être strictement positive");
    error.statusCode = 400;
    throw error;
  }

  const material = await RawMaterial.findById(materialId);

  if (!material) {
    const error = new Error("Matière première introuvable");
    error.statusCode = 404;
    throw error;
  }

  return stockMovementRepository.create({
    matiere: material._id,
    type: "ENTREE",
    quantite: quantity
  });
}


async function listMovements(filters) {
  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    const error = new Error("page doit être un entier positif");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    const error = new Error("limit doit être compris entre 1 et 100");
    error.statusCode = 400;
    throw error;
  }

  const { material, type, from, to } = filters;

  if (type && !["ENTREE", "SORTIE"].includes(type)) {
    const error = new Error("type doit être ENTREE ou SORTIE");
    error.statusCode = 400;
    throw error;
  }

  if (material && !/^[a-f\d]{24}$/i.test(material)) {
    const error = new Error("Identifiant de matière invalide");
    error.statusCode = 400;
    throw error;
  }

  const isValidDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value);

  if (from && !isValidDate(from)) {
    const error = new Error("Date from invalide (YYYY-MM-DD)");
    error.statusCode = 400;
    throw error;
  }

  if (to && !isValidDate(to)) {
    const error = new Error("Date to invalide (YYYY-MM-DD)");
    error.statusCode = 400;
    throw error;
  }

  if (from && to && from > to) {
    const error = new Error("from doit être antérieure ou égale à to");
    error.statusCode = 400;
    throw error;
  }

  return stockMovementRepository.findFiltered({
    material,
    type,
    from,
    to,
    page,
    limit
  });
}

module.exports = { addEntry , listMovements };