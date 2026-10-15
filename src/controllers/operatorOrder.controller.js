const operatorOrderService =
  require("../services/operatorOrder.service");

async function list(req, res, next) {
  try {
    const result =
      await operatorOrderService.listMyOrders({
        userId: req.user._id,
        status: req.query.status,
        page: req.pagination.page,
        limit: req.pagination.limit
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
    const order =
      await operatorOrderService.getMyOrder({
        userId: req.user._id,
        orderId: req.params.id
      });

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById
};