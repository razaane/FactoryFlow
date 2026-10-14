
const StockMovement = require("../models/stockMovement.model");

async function create(data) {
  return StockMovement.create(data);
}

async function findFiltered({
  material,
  type,
  from,
  to,
  page,
  limit
}) {
  const filter = {};

  if (material) {
    filter.matiere = material;
  }

  if (type) {
    filter.type = type;
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      filter.createdAt.$gte = new Date(from);
    }

    if (to) {
      const endDate = new Date(to);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    StockMovement.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("matiere")
      .lean(),

    StockMovement.countDocuments(filter)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

module.exports = { create, findFiltered };