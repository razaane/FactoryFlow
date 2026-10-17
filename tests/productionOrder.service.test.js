
const mongoose = require("mongoose");

jest.mock("../src/models/product.model");
jest.mock("../src/models/user.model");
jest.mock("../src/repositories/productionOrder.repository");

const Product = require("../src/models/product.model");
const User = require("../src/models/user.model");
const repository = require("../src/repositories/productionOrder.repository");

const service = require("../src/services/productionOrder.service");

const productId = "507f1f77bcf86cd799439011";
const operatorId = "507f1f77bcf86cd799439022";
const orderId = "507f1f77bcf86cd799439033";
const createdBy = "507f1f77bcf86cd799439044";

const product = {
  _id: productId,
  composition: [
    {
      material: "507f1f77bcf86cd799439055",
      quantity: 2
    }
  ]
};

const operator = {
  _id: operatorId,
  role: "Operateur"
};

const order = {
  _id: orderId,
  status: "PLANIFIE",
  quantity: 5,
  composition: product.composition
};

beforeEach(() => {
  jest.clearAllMocks();

  Product.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue(product)
  });

  User.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue(operator)
  });
});

describe("productionOrder.service - create", () => {
  test("crée un ordre de production valide", async () => {
    repository.create.mockImplementation(async data => data);

    const result = await service.create({
      productId,
      quantity: 5,
      assignedTo: operatorId,
      createdBy
    });

    expect(result.status).toBe("PLANIFIE");
    expect(result.product).toBe(product._id);
    expect(result.quantity).toBe(5);
    expect(result.composition).toEqual(product.composition);
    expect(result.assignedTo).toBe(operator._id);
    expect(result.createdBy).toBe(createdBy);
    expect(result.reference).toMatch(/^OF-\d+$/);
  });

  test.each([0, -1, NaN, Infinity, "5"])(
    "refuse une quantité invalide : %s",
    async quantity => {
      await expect(
        service.create({
          productId,
          quantity,
          assignedTo: operatorId,
          createdBy
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    }
  );

  test("refuse un identifiant produit invalide", async () => {
    await expect(
      service.create({
        productId: "invalid",
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("refuse un identifiant opérateur invalide", async () => {
    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: "invalid",
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("retourne 404 si le produit n'existe pas", async () => {
    Product.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    });

    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("retourne 404 si l'utilisateur n'existe pas", async () => {
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    });

    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("refuse un utilisateur qui n'est pas opérateur", async () => {
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: operatorId,
        role: "Admin"
      })
    });

    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("retourne 409 si la référence existe déjà", async () => {
    repository.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test("propage les autres erreurs du repository", async () => {
    const error = new Error("Erreur base de données");
    repository.create.mockRejectedValue(error);

    await expect(
      service.create({
        productId,
        quantity: 5,
        assignedTo: operatorId,
        createdBy
      })
    ).rejects.toBe(error);
  });
});

describe("productionOrder.service - update", () => {
  test("modifie la quantité d'un ordre planifié", async () => {
    repository.findById.mockResolvedValue(order);
    repository.updateById.mockResolvedValue({
      ...order,
      quantity: 10
    });

    const result = await service.update(orderId, {
      quantity: 10
    });

    expect(repository.updateById).toHaveBeenCalledWith(
      orderId,
      { quantity: 10 }
    );
    expect(result.quantity).toBe(10);
  });

  test("retourne 404 si l'ordre n'existe pas", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update(orderId, { quantity: 10 })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("refuse de modifier un ordre non planifié", async () => {
    repository.findById.mockResolvedValue({
      ...order,
      status: "EN_COURS"
    });

    await expect(
      service.update(orderId, { quantity: 10 })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test.each([0, -1, NaN, Infinity, "10"])(
    "refuse une quantité invalide : %s",
    async quantity => {
      repository.findById.mockResolvedValue(order);

      await expect(
        service.update(orderId, { quantity })
      ).rejects.toMatchObject({ statusCode: 400 });
    }
  );

  test("refuse un identifiant opérateur invalide", async () => {
    repository.findById.mockResolvedValue(order);

    await expect(
      service.update(orderId, { assignedTo: "invalid" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("refuse un utilisateur qui n'est pas opérateur", async () => {
    repository.findById.mockResolvedValue(order);
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: operatorId,
        role: "Admin"
      })
    });

    await expect(
      service.update(orderId, { assignedTo: operatorId })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("ne modifie pas la composition de l'ordre", async () => {
    repository.findById.mockResolvedValue(order);
    repository.updateById.mockResolvedValue(order);

    await service.update(orderId, {
      quantity: 10,
      assignedTo: operatorId
    });

    expect(repository.updateById).toHaveBeenCalledWith(
      orderId,
      {
        quantity: 10,
        assignedTo: operatorId
      }
    );
  });
});

describe("productionOrder.service - cancel", () => {
  test("annule un ordre planifié", async () => {
    repository.findById.mockResolvedValue(order);
    repository.cancelById.mockImplementation(
      async (id, data) => ({ id, ...data })
    );

    const result = await service.cancel(orderId);

    expect(repository.cancelById).toHaveBeenCalledWith(
      orderId,
      expect.objectContaining({ status: "ANNULE" })
    );
    expect(result.status).toBe("ANNULE");
    expect(result.cancelledAt).toBeInstanceOf(Date);
  });

  test("retourne 404 si l'ordre n'existe pas", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.cancel(orderId)
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("refuse d'annuler un ordre non planifié", async () => {
    repository.findById.mockResolvedValue({
      ...order,
      status: "TERMINE"
    });

    await expect(
      service.cancel(orderId)
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

describe("productionOrder.service - list", () => {
  test("transmet les filtres et la pagination au repository", async () => {
    const filters = {
      status: "PLANIFIE",
      product: productId,
      from: "2026-10-01",
      to: "2026-10-21",
      page: 2,
      limit: 10
    };

    repository.findFiltered.mockResolvedValue([]);

    await service.list(filters);

    expect(repository.findFiltered).toHaveBeenCalledWith({
      filter: {
        status: "PLANIFIE",
        product: productId,
        createdAt: {
          $gte: new Date("2026-10-01"),
          $lte: expect.any(Date)
        }
      },
      page: 2,
      limit: 10
    });
  });

  test("appelle le repository sans filtre si aucun filtre n'est fourni", async () => {
    repository.findFiltered.mockResolvedValue([]);

    await service.list({
      page: 1,
      limit: 10
    });

    expect(repository.findFiltered).toHaveBeenCalledWith({
      filter: {},
      page: 1,
      limit: 10
    });
  });
});
