const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
  {
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true
    },
    type: {
      type: String,
      enum: ["ENTREE", "SORTIE"],
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);