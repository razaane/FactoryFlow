const mongoose = require("mongoose");

const productRepository = require("../repositories/product.repository");
const rawMaterialRepository = require("../repositories/rawMaterial.repository");


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

    const material =
      await rawMaterialRepository.findById(materialId);

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

async function list({ page, limit, search = "" }) {
  return productRepository.findAll({
    page,
    limit,
    search: search.trim()
  });
}

async function getById(id) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw createError(
      "Produit introuvable",
      404
    );
  }

  return product;
}
async function update(id, data) {
  const { reference, name, description = "", composition } = data;

  const existingProduct =
    await productRepository.findById(id);

  if (!existingProduct) {
    throw createError(
      "Produit introuvable",
      404
    );
  }

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


  if (
    !Array.isArray(composition) ||
    composition.length === 0
  ) {
    throw createError(
      "La composition doit contenir au moins une matière",
      400
    );
  }

  const productWithSameReference =
    await productRepository.findByReference(
      reference.trim()
    );

  if (
    productWithSameReference &&
    productWithSameReference._id.toString() !== id.toString()
  ) {
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

    
    const material =
      await rawMaterialRepository.findById(materialId);

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
    const updatedProduct =
      await productRepository.update(id, {
        reference: reference.trim(),
        name: name.trim(),
        description,
        composition: validatedComposition
      });

    return updatedProduct;
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

module.exports = {
  create,
  list,
  getById,
  update
};