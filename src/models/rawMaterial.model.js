const mongoose = require("mongoose");


const rawMaterialSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, enum:["kg", "g", "L", "mL", "unité", "m"] },
    alertThreshold: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawMaterial", rawMaterialSchema);