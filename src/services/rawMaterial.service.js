const rawMaterialRepository = require("../repositories/rawMaterial.repository");
const StockMovement = require("../models/stockMovement.model");

const {
  validateCreateMaterial,
  validateId,
  validateListQuery,
  validateUpdateMaterial
} = require("../validators/rawMaterial.validator");

const AppError = require("../utils/AppError");

async function create(body) {
    validateCreateMaterial(body);

    const reference = body.reference.trim().toUpperCase();

    const existing = await rawMaterialRepository.findByReference(reference);

    if (existing) {
        throw new AppError("Cette référence existe déjà", 409);
    }

    return rawMaterialRepository.create({
        reference,
        name: body.name,
        unit: body.unit,
        stockInitial: body.stockInitial,
        alertThreshold: body.alertThreshold ?? 0
    });
}



async function getQuantity(material) {
  const result = await StockMovement.aggregate([
    { $match: { matiere: material._id } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$quantite" }
      }
    }
  ]);

  let entrees = 0;
  let sorties = 0;

  for (const movement of result) {
    if (movement._id === "ENTREE") entrees += movement.total;
    if (movement._id === "SORTIE") sorties += movement.total;
  }

  return material.stockInitial + entrees - sorties;
}

function format(material, quantity) {
  return {
    id: material._id,
    reference: material.reference,
    name: material.name,
    unit: material.unit,
    alertThreshold: material.alertThreshold,
    quantity,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt
  };
}

async function list(query) {
  const { page, limit } = validateListQuery(query);
  const skip = (page - 1) * limit;

  const [materials, total] = await Promise.all([
    rawMaterialRepository.findAll(skip, limit),
    rawMaterialRepository.count()
  ]);

  const items = await Promise.all(
    materials.map(async material =>
      format(material, await getQuantity(material))
    )
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function getById(id) {
  validateId(id);

  const material = await rawMaterialRepository.findById(id);
  if (!material) {
    throw new AppError("Matière première introuvable", 404);
  }

  return format(material, await getQuantity(material));
}

async function update(id, body) {
  validateId(id);
  validateUpdateMaterial(body);

  const material = await rawMaterialRepository.findById(id);
  if (!material) {
    throw new AppError("Matière première introuvable", 404);
  }

  const data = {};

  if (body.name !== undefined) data.name = body.name.trim();
  if (body.unit !== undefined) data.unit = body.unit;
  if (body.alertThreshold !== undefined) {
    data.alertThreshold = body.alertThreshold;
  }

  if (body.reference !== undefined) {
    const reference = body.reference.trim().toUpperCase();
    const other = await rawMaterialRepository.findByReference(reference);

    if (other && String(other._id) !== String(id)) {
      throw new AppError("Cette référence existe déjà", 409);
    }

    data.reference = reference;
  }

  try {
    const updated = await rawMaterialRepository.updateById(id, data);
    return format(updated, await getQuantity(updated));
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Cette référence existe déjà", 409);
    }
    throw err;
  }
}

module.exports = { create, list, getById, update };