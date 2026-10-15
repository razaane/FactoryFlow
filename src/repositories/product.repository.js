const Product = require("../models/product.model");

async function create(data) {
  return Product.create(data);
}

async function findByReference(reference) {
  return Product.findOne({ reference });
}

async function findAll({ page, limit, search }) {
  const filter = {};

  if (search) {
    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.$or = [
      {
        reference: {
          $regex: escapedSearch,
          $options: "i"
        }
      },
      {
        name: {
          $regex: escapedSearch,
          $options: "i"
        }
      }
    ];
  }

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate("composition.material")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter)
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

async function findById(id) {
  return Product.findById(id)
    .populate("composition.material")
    .lean();
}

async function update(id, data) {
  return Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  )
    .populate("composition.material")
    .lean();
}

module.exports = {
  create,
  findByReference,
  findAll,
  findById,
  update
};