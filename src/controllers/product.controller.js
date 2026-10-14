
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

module.exports = { create };