
const {
  calculateRequirements
} = require("../src/services/requirements.service");

describe("requirementsService", () => {
  test("doit calculer les besoins en matières", () => {
    const composition = [
      { material: "mat1", quantity: 2 },
      { material: "mat2", quantity: 3 }
    ];

    const result = calculateRequirements(composition, 5);

    expect(result).toEqual([
      { material: "mat1", quantity: 10 },
      { material: "mat2", quantity: 15 }
    ]);
  });

  test("doit refuser une quantité invalide", () => {
    expect(() => calculateRequirements([], 0)).toThrow(
      "Composition ou quantité invalide"
    );
  });
});
