
function calculateRequirements(composition, orderQuantity) {
  if (!Array.isArray(composition) || orderQuantity <= 0) {
    const error = new Error("Composition ou quantité invalide");
    error.statusCode = 400;
    throw error;
  }

  return composition.map((item) => ({
    material: item.material,
    quantity: item.quantity * orderQuantity
  }));
}

module.exports = { calculateRequirements };
