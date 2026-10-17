const stockService = require("../src/services/stock.service");
const RawMaterial = require("../src/models/rawMaterial.model");
const stockMovementRepository = require("../src/repositories/stockMovement.repository");

jest.mock("../src/models/rawMaterial.model", () => ({
  findById: jest.fn(),
}));

jest.mock("../src/repositories/stockMovement.repository", () => ({
  create: jest.fn(),
  findFiltered: jest.fn(),
}));

describe("Stock Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addEntry", () => {
    test("ajoute une entrée de stock avec une quantité valide", async () => {
      const material = { _id: "material123" };
      const movement = {
        matiere: "material123",
        type: "ENTREE",
        quantite: 20,
      };

      RawMaterial.findById.mockResolvedValue(material);
      stockMovementRepository.create.mockResolvedValue(movement);

      const result = await stockService.addEntry("material123", 20);

      expect(RawMaterial.findById).toHaveBeenCalledWith("material123");
      expect(stockMovementRepository.create).toHaveBeenCalledWith({
        matiere: "material123",
        type: "ENTREE",
        quantite: 20,
      });
      expect(result).toEqual(movement);
    });

    test("refuse une quantité égale à zéro", async () => {
      await expect(
        stockService.addEntry("material123", 0)
      ).rejects.toMatchObject({
        message: "La quantité doit être strictement positive",
        statusCode: 400,
      });

      expect(RawMaterial.findById).not.toHaveBeenCalled();
    });

    test("refuse une quantité négative", async () => {
      await expect(
        stockService.addEntry("material123", -5)
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    test("refuse une quantité qui n'est pas un nombre valide", async () => {
      await expect(
        stockService.addEntry("material123", NaN)
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    test("retourne une erreur 404 si la matière n'existe pas", async () => {
      RawMaterial.findById.mockResolvedValue(null);

      await expect(
        stockService.addEntry("material123", 10)
      ).rejects.toMatchObject({
        message: "Matière première introuvable",
        statusCode: 404,
      });

      expect(stockMovementRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("listMovements", () => {
    test("retourne les mouvements avec les filtres et la pagination", async () => {
      const movements = [{ type: "ENTREE", quantite: 20 }];

      stockMovementRepository.findFiltered.mockResolvedValue(movements);

      const result = await stockService.listMovements({
        material: "507f1f77bcf86cd799439011",
        type: "ENTREE",
        from: "2026-10-01",
        to: "2026-10-21",
        page: "2",
        limit: "5",
      });

      expect(stockMovementRepository.findFiltered).toHaveBeenCalledWith({
        material: "507f1f77bcf86cd799439011",
        type: "ENTREE",
        from: "2026-10-01",
        to: "2026-10-21",
        page: 2,
        limit: 5,
      });

      expect(result).toEqual(movements);
    });

    test("utilise la pagination par défaut", async () => {
      stockMovementRepository.findFiltered.mockResolvedValue([]);

      await stockService.listMovements({});

      expect(stockMovementRepository.findFiltered).toHaveBeenCalledWith({
        material: undefined,
        type: undefined,
        from: undefined,
        to: undefined,
        page: 1,
        limit: 10,
      });
    });

    test("refuse un numéro de page invalide", async () => {
      await expect(
        stockService.listMovements({ page: "0" })
      ).rejects.toMatchObject({
        message: "page doit être un entier positif",
        statusCode: 400,
      });
    });

    test("refuse une limite supérieure à 100", async () => {
      await expect(
        stockService.listMovements({ limit: "101" })
      ).rejects.toMatchObject({
        message: "limit doit être compris entre 1 et 100",
        statusCode: 400,
      });
    });

    test("refuse un type de mouvement invalide", async () => {
      await expect(
        stockService.listMovements({ type: "INVALID" })
      ).rejects.toMatchObject({
        message: "type doit être ENTREE ou SORTIE",
        statusCode: 400,
      });
    });

    test("refuse un identifiant de matière invalide", async () => {
      await expect(
        stockService.listMovements({ material: "123" })
      ).rejects.toMatchObject({
        message: "Identifiant de matière invalide",
        statusCode: 400,
      });
    });

    test("refuse une date invalide", async () => {
      await expect(
        stockService.listMovements({ from: "2026-02-30" })
      ).rejects.toMatchObject({
        message: "Date from invalide (YYYY-MM-DD)",
        statusCode: 400,
      });
    });

    test("refuse une date de début postérieure à la date de fin", async () => {
      await expect(
        stockService.listMovements({
          from: "2026-10-21",
          to: "2026-10-01",
        })
      ).rejects.toMatchObject({
        message: "from doit être antérieure ou égale à to",
        statusCode: 400,
      });
    });
  });
});
