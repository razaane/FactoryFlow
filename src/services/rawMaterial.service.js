const rawMaterialRepository = require("../repositories/rawMaterial.repository");
const { validateCreateMaterial } = require("../validators/rawMaterial.validator");
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

module.exports = { create };
