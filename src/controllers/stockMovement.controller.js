
const stockService = require("../services/stock.service");

async function list(req, res, next) {
  try {
    const result = await stockService.listMovements(req.query);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { list };