const mongoose = require("mongoose");

const orderCompositionSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const productionOrderSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    composition: {
      type: [orderCompositionSchema],
      required: true
    },

    status: {
      type: String,
      enum: [
        "PLANIFIE",
        "EN_COURS",
        "TERMINE",
        "ANNULE"
      ],
      default: "PLANIFIE",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    startedAt: {
      type: Date,
      default: null
    },

    startedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    finishedAt: {
      type: Date,
      default: null
    },

    finishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ProductionOrder",
  productionOrderSchema
);