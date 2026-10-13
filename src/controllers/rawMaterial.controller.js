const rawMaterialService = require("../services/rawMaterial.service");

async function create(req, res, next) {
    try {
        const material = await rawMaterialService.create(req.body);

        res.status(201).json({
        success: true,
        message: "Matière première créée",
        data: material});
    } catch (err) {
        next(err);
    }
}

module.exports = { create };
