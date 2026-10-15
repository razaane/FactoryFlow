const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const productionOrderRepository =
  require("../repositories/productionOrder.repository");

async function listMyOrders({
  userId,
  status,
  page,
  limit
}) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError(
      "Utilisateur invalide",
      400
    );
  }

  return productionOrderRepository.findByAssignedTo({
    assignedTo: userId,
    status,
    page,
    limit
  });
}

async function getMyOrder({
  userId,
  orderId
}) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new AppError(
      "Identifiant ordre invalide",
      400
    );
  }

  const order =
    await productionOrderRepository
      .findByIdAndAssignedTo(
        orderId,
        userId
      );

  if (!order) {
    throw new AppError(
      "Ordre introuvable",
      404
    );
  }

  return order;
}

module.exports = {
  listMyOrders,
  getMyOrder
};