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


async function list(req, res, next) {
  try {
    const result = await rawMaterialService.list(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const material = await rawMaterialService.getById(req.params.id);
    res.json({ success: true, data: material });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const material = await rawMaterialService.update(req.params.id, req.body);
    res.json({
      success: true,
      message: "Matière première modifiée",
      data: material
    });
  } catch (err) {
    next(err);
  }
}


async function addStockEntry(req, res, next) {
  try {
    const stockService = require("../services/stock.service");

    const quantity = req.body.quantity;

    if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
      const error = new Error("La quantité doit être un nombre valide");
      error.statusCode = 400;
      throw error;
    }

    const movement = await stockService.addEntry(
      req.params.id,
      quantity
    );

    return res.status(201).json({
      success: true,
      message: "Entrée de stock enregistrée",
      data: movement
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getById, update , addStockEntry };
