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

module.exports = { create, list, getById, update };
