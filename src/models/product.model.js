
const mongoose = require("mongoose");

const compositionSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: value => Number.isFinite(value) && value > 0,
        message: "La quantité doit être strictement positive"
      }
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    composition: {
      type: [compositionSchema],
      required: true,
      validate: {
        validator: composition => composition.length >= 1,
        message: "La composition doit contenir au moins une matière"
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);