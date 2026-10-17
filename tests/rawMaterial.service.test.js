
jest.mock("../src/repositories/rawMaterial.repository");
jest.mock("../src/models/stockMovement.model");

jest.mock("../src/validators/rawMaterial.validator", () => ({
  validateCreateMaterial: jest.fn(),
  validateId: jest.fn(),
  validateListQuery: jest.fn(),
  validateUpdateMaterial: jest.fn(),
}));

const rawMaterialRepository = require("../src/repositories/rawMaterial.repository");
const StockMovement = require("../src/models/stockMovement.model");

const {
  validateCreateMaterial,
  validateId,
  validateListQuery,
  validateUpdateMaterial,
} = require("../src/validators/rawMaterial.validator");

const rawMaterialService = require("../src/services/rawMaterial.service");

describe("Raw Material Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("doit créer une matière avec une référence en majuscules", async () => {
      validateCreateMaterial.mockReturnValue(undefined);
      rawMaterialRepository.findByReference.mockResolvedValue(null);

      const material = {
        _id: "mat123",
        reference: "ACIER",
        name: "Acier",
        unit: "kg",
        stockInitial: 100,
        alertThreshold: 10,
      };

      rawMaterialRepository.create.mockResolvedValue(material);

      const result = await rawMaterialService.create({
        reference: " acier ",
        name: "Acier",
        unit: "kg",
        stockInitial: 100,
        alertThreshold: 10,
      });

      expect(rawMaterialRepository.findByReference).toHaveBeenCalledWith("ACIER");

      expect(rawMaterialRepository.create).toHaveBeenCalledWith({
        reference: "ACIER",
        name: "Acier",
        unit: "kg",
        stockInitial: 100,
        alertThreshold: 10,
      });

      expect(result).toEqual(material);
    });

    test("doit refuser une référence déjà utilisée", async () => {
      validateCreateMaterial.mockReturnValue(undefined);
      rawMaterialRepository.findByReference.mockResolvedValue({
        reference: "ACIER",
      });

      await expect(
        rawMaterialService.create({
          reference: "acier",
          name: "Acier",
          unit: "kg",
          stockInitial: 100,
        })
      ).rejects.toMatchObject({
        message: "Cette référence existe déjà",
        statusCode: 409,
      });

      expect(rawMaterialRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    test("doit retourner une matière avec son stock calculé", async () => {
      const material = {
        _id: "mat123",
        reference: "ACIER",
        name: "Acier",
        unit: "kg",
        stockInitial: 100,
        alertThreshold: 10,
        createdAt: new Date("2026-10-21"),
        updatedAt: new Date("2026-10-21"),
      };

      rawMaterialRepository.findById.mockResolvedValue(material);

      StockMovement.aggregate.mockResolvedValue([
        { _id: "ENTREE", total: 20 },
        { _id: "SORTIE", total: 5 },
      ]);

      const result = await rawMaterialService.getById("mat123");

      expect(validateId).toHaveBeenCalledWith("mat123");
      expect(StockMovement.aggregate).toHaveBeenCalled();

      expect(result).toMatchObject({
        id: "mat123",
        reference: "ACIER",
        quantity: 115,
        unit: "kg",
      });
    });

    test("doit retourner une erreur 404 si la matière n'existe pas", async () => {
      rawMaterialRepository.findById.mockResolvedValue(null);

      await expect(
        rawMaterialService.getById("mat-inexistant")
      ).rejects.toMatchObject({
        message: "Matière première introuvable",
        statusCode: 404,
      });
    });
  });

  describe("update", () => {
    test("doit modifier une matière existante", async () => {
      validateUpdateMaterial.mockReturnValue(undefined);

      const material = {
        _id: "mat123",
        reference: "ACIER",
        name: "Acier",
        unit: "kg",
        stockInitial: 100,
        alertThreshold: 10,
      };

      rawMaterialRepository.findById.mockResolvedValue(material);

      const updatedMaterial = {
        ...material,
        name: "Acier renforcé",
        alertThreshold: 20,
      };

      rawMaterialRepository.updateById.mockResolvedValue(updatedMaterial);
      StockMovement.aggregate.mockResolvedValue([]);

      const result = await rawMaterialService.update("mat123", {
        name: "Acier renforcé",
        alertThreshold: 20,
      });

      expect(rawMaterialRepository.updateById).toHaveBeenCalledWith("mat123", {
        name: "Acier renforcé",
        alertThreshold: 20,
      });

      expect(result).toMatchObject({
        name: "Acier renforcé",
        alertThreshold: 20,
        quantity: 100,
      });
    });

    test("doit retourner une erreur 404 si la matière à modifier n'existe pas", async () => {
      validateUpdateMaterial.mockReturnValue(undefined);
      rawMaterialRepository.findById.mockResolvedValue(null);

      await expect(
        rawMaterialService.update("mat123", { name: "Nouvelle matière" })
      ).rejects.toMatchObject({
        message: "Matière première introuvable",
        statusCode: 404,
      });

      expect(rawMaterialRepository.updateById).not.toHaveBeenCalled();
    });
  });

  describe("list", () => {
    test("doit retourner les matières avec pagination", async () => {
      validateListQuery.mockReturnValue({ page: 1, limit: 10 });

      rawMaterialRepository.findAll.mockResolvedValue([
        {
          _id: "mat123",
          reference: "ACIER",
          name: "Acier",
          unit: "kg",
          stockInitial: 100,
          alertThreshold: 10,
        },
      ]);

      rawMaterialRepository.count.mockResolvedValue(1);
      StockMovement.aggregate.mockResolvedValue([]);

      const result = await rawMaterialService.list({ page: "1", limit: "10" });

      expect(rawMaterialRepository.findAll).toHaveBeenCalledWith(0, 10);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(100);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe("getAlerts", () => {
    test("doit retourner les matières sous le seuil d'alerte", async () => {
      const alerts = [{ reference: "ACIER", quantity: 5, alertThreshold: 10 }];

      rawMaterialRepository.findBelowThreshold.mockResolvedValue(alerts);

      const result = await rawMaterialService.getAlerts();

      expect(result).toEqual(alerts);
      expect(rawMaterialRepository.findBelowThreshold).toHaveBeenCalled();
    });
  });
});
