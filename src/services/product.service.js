
const mongoose = require("mongoose");

const productRepository = require("../repositories/product.repository");
const rawMaterialRepository = require("../repositories/rawMaterial.repository");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function create(data) {
  const { reference, name, description = "", composition } = data;

  if (
    typeof reference !== "string" ||
    !reference.trim() ||
    typeof name !== "string" ||
    !name.trim()
  ) {
    throw createError(
      "La référence et le nom sont obligatoires",
      400
    );
  }

  if (!Array.isArray(composition) || composition.length === 0) {
    throw createError(
      "La composition doit contenir au moins une matière",
      400
    );
  }


  const existingProduct =
    await productRepository.findByReference(reference.trim());

  if (existingProduct) {
    throw createError(
      "Cette référence produit existe déjà",
      409
    );
  }

  const seenMaterials = new Set();
  const validatedComposition = [];

  for (const item of composition) {
    if (
      !item ||
      typeof item.material !== "string" ||
      !mongoose.isValidObjectId(item.material)
    ) {
      throw createError(
        "Identifiant de matière invalide",
        400
      );
    }

    const materialId = item.material;

    if (seenMaterials.has(materialId)) {
      throw createError(
        "Une matière ne peut pas apparaître deux fois",
        400
      );
    }

    seenMaterials.add(materialId);

    if (
      typeof item.quantity !== "number" ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0
    ) {
      throw createError(
        "Chaque quantité doit être strictement positive",
        400
      );
    }

    const material = await rawMaterialRepository.findById(materialId);

    if (!material) {
      throw createError(
        "Matière première introuvable",
        404
      );
    }

    validatedComposition.push({
      material: material._id,
      quantity: item.quantity
    });
  }

  try {
    return await productRepository.create({
      reference: reference.trim(),
      name: name.trim(),
      description,
      composition: validatedComposition
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createError(
        "Cette référence produit existe déjà",
        409
      );
    }

    throw error;
  }
}

module.exports = { create };