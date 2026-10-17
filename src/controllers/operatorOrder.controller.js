const operatorOrderService = require("../services/operatorOrder.service");
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


function getOperatorId(req) {
  return req.user.id || req.user._id;
}

async function start(req, res, next) {
  try {
    const order = await operatorOrderService.start(
      req.params.id,
      getOperatorId(req)
    );

    res.json({
      success: true,
      message: "Ordre démarré",
      data: order
    });
  } catch (error) {
    next(error);
  }
}

async function finish(req, res, next) {
  try {
    const order = await operatorOrderService.finish(
      req.params.id,
      getOperatorId(req)
    );

    res.json({
      success: true,
      message: "Ordre terminé",
      data: order
    });
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    const result = await operatorOrderService.history(
      getOperatorId(req),
      req.query
    );

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
   start,
  finish,
  history
};