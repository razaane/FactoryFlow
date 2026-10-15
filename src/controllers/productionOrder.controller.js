const productionOrderService =
  require("../services/productionOrder.service");

async function create(req, res, next) {
  try {
    const order =
      await productionOrderService.create({
        productId: req.body.product,
        quantity: req.body.quantity,
        assignedTo: req.body.assignedTo,
        createdBy: req.user._id
      });

    return res.status(201).json({
      success: true,
      message: "Ordre de fabrication créé avec succès",
      data: order
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const order =
      await productionOrderService.update(
        req.params.id,
        {
          quantity: req.body.quantity,
          assignedTo: req.body.assignedTo
        }
      );

    return res.status(200).json({
      success: true,
      message: "Ordre modifié avec succès",
      data: order
    });
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const order =
      await productionOrderService.cancel(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Ordre annulé avec succès",
      data: order
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,update,cancel
};