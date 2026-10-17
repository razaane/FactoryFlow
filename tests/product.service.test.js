const productService = require("../src/services/product.service");
const productRepository = require("../src/repositories/product.repository");
const rawMaterialRepository = require("../src/repositories/rawMaterial.repository");

jest.mock("../src/repositories/product.repository", () => ({
  findByReference: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
}));

jest.mock("../src/repositories/rawMaterial.repository", () => ({
  findById: jest.fn(),
}));

describe("Product Service", () => {
  const materialId = "507f1f77bcf86cd799439011";
  const productId = "507f1f77bcf86cd799439022";

  const material = { _id: materialId };

  const validData = {
    reference: " PROD-01 ",
    name: " Produit test ",
    description: "Description test",
    composition: [{ material: materialId, quantity: 2 }],
  };

  const existingProduct = {
    _id: productId,
    reference: "PROD-01",
    name: "Produit test",
    composition: [{ material: materialId, quantity: 2 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    productRepository.findByReference.mockResolvedValue(null);
    rawMaterialRepository.findById.mockResolvedValue(material);
  });

  describe("create", () => {
    test("crée un produit avec des données valides", async () => {
      productRepository.create.mockResolvedValue(existingProduct);

      const result = await productService.create(validData);

      expect(productRepository.findByReference).toHaveBeenCalledWith("PROD-01");
      expect(productRepository.create).toHaveBeenCalledWith({
        reference: "PROD-01",
        name: "Produit test",
        description: "Description test",
        composition: [{ material: materialId, quantity: 2 }],
      });
      expect(result).toEqual(existingProduct);
    });

    test("refuse une référence ou un nom manquant", async () => {
      await expect(
        productService.create({ ...validData, name: " " })
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(productRepository.create).not.toHaveBeenCalled();
    });

    test("refuse une composition vide", async () => {
      await expect(
        productService.create({ ...validData, composition: [] })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test("refuse une référence déjà utilisée", async () => {
      productRepository.findByReference.mockResolvedValue(existingProduct);

      await expect(
        productService.create(validData)
      ).rejects.toMatchObject({
        message: "Cette référence produit existe déjà",
        statusCode: 409,
      });

      expect(productRepository.create).not.toHaveBeenCalled();
    });

    test("refuse un identifiant de matière invalide", async () => {
      await expect(
        productService.create({
          ...validData,
          composition: [{ material: "123", quantity: 2 }],
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test("refuse une quantité nulle", async () => {
      await expect(
        productService.create({
          ...validData,
          composition: [{ material: materialId, quantity: 0 }],
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test("refuse une matière inexistante", async () => {
      rawMaterialRepository.findById.mockResolvedValue(null);

      await expect(
        productService.create(validData)
      ).rejects.toMatchObject({
        message: "Matière première introuvable",
        statusCode: 404,
      });
    });

    test("refuse deux fois la même matière dans la composition", async () => {
      await expect(
        productService.create({
          ...validData,
          composition: [
            { material: materialId, quantity: 2 },
            { material: materialId, quantity: 3 },
          ],
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test("convertit une erreur MongoDB 11000 en erreur 409", async () => {
      productRepository.create.mockRejectedValue({ code: 11000 });

      await expect(
        productService.create(validData)
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe("list", () => {
    test("transmet les paramètres et nettoie la recherche", async () => {
      const products = { items: [existingProduct], total: 1 };
      productRepository.findAll.mockResolvedValue(products);

      const result = await productService.list({
        page: 2,
        limit: 5,
        search: "  PROD  ",
      });

      expect(productRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        search: "PROD",
      });
      expect(result).toEqual(products);
    });

    test("utilise une recherche vide par défaut", async () => {
      productRepository.findAll.mockResolvedValue([]);

      await productService.list({ page: 1, limit: 10 });

      expect(productRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: "",
      });
    });
  });

  describe("getById", () => {
    test("retourne le produit existant", async () => {
      productRepository.findById.mockResolvedValue(existingProduct);

      const result = await productService.getById(productId);

      expect(productRepository.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(existingProduct);
    });

    test("retourne une erreur 404 si le produit est introuvable", async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(
        productService.getById(productId)
      ).rejects.toMatchObject({
        message: "Produit introuvable",
        statusCode: 404,
      });
    });
  });

  describe("update", () => {
    test("modifie un produit avec des données valides", async () => {
      const updatedProduct = {
        ...existingProduct,
        reference: "PROD-02",
        name: "Produit modifié",
      };

      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.findByReference.mockResolvedValue(null);
      productRepository.update.mockResolvedValue(updatedProduct);

      const result = await productService.update(productId, {
        ...validData,
        reference: " PROD-02 ",
        name: " Produit modifié ",
      });

      expect(productRepository.update).toHaveBeenCalledWith(productId, {
        reference: "PROD-02",
        name: "Produit modifié",
        description: "Description test",
        composition: [{ material: materialId, quantity: 2 }],
      });
      expect(result).toEqual(updatedProduct);
    });

    test("refuse de modifier un produit inexistant", async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(
        productService.update(productId, validData)
      ).rejects.toMatchObject({
        message: "Produit introuvable",
        statusCode: 404,
      });

      expect(productRepository.update).not.toHaveBeenCalled();
    });

    test("refuse une référence utilisée par un autre produit", async () => {
      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.findByReference.mockResolvedValue({
        _id: "507f1f77bcf86cd799439033",
        reference: "PROD-01",
      });

      await expect(
        productService.update(productId, validData)
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(productRepository.update).not.toHaveBeenCalled();
    });

    test("refuse une composition vide", async () => {
      productRepository.findById.mockResolvedValue(existingProduct);

      await expect(
        productService.update(productId, {
          ...validData,
          composition: [],
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    test("convertit une erreur MongoDB 11000 en erreur 409", async () => {
      productRepository.findById.mockResolvedValue(existingProduct);
      productRepository.findByReference.mockResolvedValue(null);
      productRepository.update.mockRejectedValue({ code: 11000 });

      await expect(
        productService.update(productId, validData)
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });
});
