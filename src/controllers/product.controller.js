
const productService = require("../services/product.service");

async function create(req, res, next) {
  try {
    const product = await productService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search ?? "";

    const result = await productService.list({
      page,
      limit,
      search
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getById(req.params.id);

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const product = await productService.update(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Produit modifié avec succès",
      data: product
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  update
};
