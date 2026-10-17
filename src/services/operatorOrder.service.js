
const mongoose = require("mongoose");
const ProductionOrder = require("../models/productionOrder.model");
const StockMovement = require("../models/stockMovement.model");
const calculateRequirements =
  require("./requirements.service").calculateRequirements;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function start(orderId, operatorId) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw createError("Identifiant invalide", 400);
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const order = await ProductionOrder.findOne({
        _id: orderId,
        assignedTo: operatorId
      }).session(session);

      if (!order) {
        throw createError("Ordre introuvable ou non affecté", 404);
      }

      if (order.status !== "PLANIFIE") {
        throw createError("Seul un ordre planifié peut démarrer", 400);
      }

      const requirements = calculateRequirements(
        order.composition,
        order.quantity
      );

      // Vérifier TOUTES les matières avant de créer des sorties.
      for (const requirement of requirements) {
        const movements = await StockMovement.find({
          matiere: requirement.material
        }).session(session);

        const stock = movements.reduce((total, movement) => {
          return total + (
            movement.type === "ENTREE"
              ? movement.quantite
              : -movement.quantite
          );
        }, 0);

        if (stock < requirement.quantity) {
          throw createError("Stock insuffisant", 400);
        }
      }

      // Aucune déduction n'est faite avant la fin des vérifications.
      for (const requirement of requirements) {
        await StockMovement.create(
          [{
            matiere: requirement.material,
            type: "SORTIE",
            quantite: requirement.quantity
          }],
          { session }
        );
      }

      order.status = "EN_COURS";
      await order.save({ session });

      result = order;
    });

    return result;
  } finally {
    await session.endSession();
  }
}

async function finish(orderId, operatorId) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw createError("Identifiant invalide", 400);
  }

  const order = await ProductionOrder.findOne({
    _id: orderId,
    assignedTo: operatorId
  });

  if (!order) {
    throw createError("Ordre introuvable ou non affecté", 404);
  }

  if (order.status !== "EN_COURS") {
    throw createError("Seul un ordre en cours peut être terminé", 400);
  }

  order.status = "TERMINE";
  await order.save();

  return order;
}

async function history(operatorId, query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  const filter = {
    assignedTo: operatorId,
    status: "TERMINE"
  };

  const [orders, total] = await Promise.all([
    ProductionOrder.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("product")
      .lean(),

    ProductionOrder.countDocuments(filter)
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

module.exports = { start, finish, history };
