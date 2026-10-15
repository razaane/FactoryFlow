const ProductionOrder = require("../models/productionOrder.model");

async function create(data) {
  return ProductionOrder.create(data);
}

async function findById(id) {
  return ProductionOrder.findById(id)
    .populate("product")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .populate("composition.material")
    .lean();
}

async function findByReference(reference) {
  return ProductionOrder.findOne({ reference });
}

async function updateById(id, data) {
  return ProductionOrder.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  )
    .populate("product")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .populate("composition.material")
    .lean();
}

async function cancelById(id, data) {
  return ProductionOrder.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  )
    .populate("product")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .populate("composition.material")
    .lean();
}

async function findFiltered({
  filter,
  page,
  limit
}) {
  const [data, total] = await Promise.all([
    ProductionOrder.find(filter)
      .populate("product")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .populate("composition.material")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    ProductionOrder.countDocuments(filter)
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function findByAssignedTo({
  assignedTo,
  status,
  page,
  limit
}) {
  const filter = {
    assignedTo
  };

  if (status) {
    filter.status = status;
  }

  const [data, total] = await Promise.all([
    ProductionOrder.find(filter)
      .populate("product")
      .populate("assignedTo", "name email role")
      .populate("composition.material")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    ProductionOrder.countDocuments(filter)
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function findByIdAndAssignedTo(id, assignedTo) {
  return ProductionOrder.findOne({
    _id: id,
    assignedTo
  })
    .populate("product")
    .populate("assignedTo", "name email role")
    .populate("composition.material")
    .lean();
}

module.exports = {
  create,
  findById,
  findByReference,
  updateById,
  cancelById,
  findFiltered,
  findByAssignedTo,
  findByIdAndAssignedTo
};