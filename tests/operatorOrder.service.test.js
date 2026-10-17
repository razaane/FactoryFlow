
const mongoose = require("mongoose");
const ProductionOrder = require("../src/models/productionOrder.model");
const StockMovement = require("../src/models/stockMovement.model");
const { calculateRequirements } = require("../src/services/requirements.service");
const {
  start,
  finish,
  history
} = require("../src/services/operatorOrder.service");

jest.mock("../src/models/productionOrder.model");
jest.mock("../src/models/stockMovement.model");
jest.mock("../src/services/requirements.service", () => ({
  calculateRequirements: jest.fn()
}));

jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  startSession: jest.fn(),
  isValidObjectId: jest.fn()
}));

const orderId = "507f1f77bcf86cd799439011";
const operatorId = "507f1f77bcf86cd799439013";
const materialId = "507f1f77bcf86cd799439015";

function createSession(order) {
  const session = {
    withTransaction: jest.fn(async callback => callback()),
    endSession: jest.fn().mockResolvedValue(undefined)
  };

  ProductionOrder.findOne.mockReturnValue({
    session: jest.fn().mockResolvedValue(order)
  });

  mongoose.startSession.mockResolvedValue(session);
  mongoose.isValidObjectId.mockReturnValue(true);

  return session;
}

describe("operatorOrderService - start", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.isValidObjectId.mockReturnValue(true);
  });

  test("refuse un identifiant invalide", async () => {
    mongoose.isValidObjectId.mockReturnValue(false);

    await expect(start("invalid", operatorId))
      .rejects.toMatchObject({ statusCode: 400 });

    expect(mongoose.startSession).not.toHaveBeenCalled();
  });

  test("refuse un ordre introuvable ou non affecté", async () => {
    const session = createSession(null);

    await expect(start(orderId, operatorId))
      .rejects.toMatchObject({ statusCode: 404 });

    expect(session.endSession).toHaveBeenCalled();
  });

  test("refuse un ordre qui n'est pas planifié", async () => {
    const session = createSession({ status: "EN_COURS" });

    await expect(start(orderId, operatorId))
      .rejects.toMatchObject({ statusCode: 400 });

    expect(session.endSession).toHaveBeenCalled();
  });

  test("refuse le démarrage si le stock est insuffisant", async () => {
    const order = {
      status: "PLANIFIE",
      quantity: 5,
      composition: []
    };

    const session = createSession(order);

    calculateRequirements.mockReturnValue([
      { material: materialId, quantity: 10 }
    ]);

    StockMovement.find.mockReturnValue({
      session: jest.fn().mockResolvedValue([
        { type: "ENTREE", quantite: 3 }
      ])
    });

    await expect(start(orderId, operatorId))
      .rejects.toMatchObject({ statusCode: 400 });

    expect(StockMovement.create).not.toHaveBeenCalled();
    expect(order.save).toBeUndefined();
    expect(session.endSession).toHaveBeenCalled();
  });

  test("démarre l'ordre et crée les sorties de stock", async () => {
    const order = {
      status: "PLANIFIE",
      quantity: 2,
      composition: [],
      save: jest.fn().mockResolvedValue(true)
    };

    const session = createSession(order);

    calculateRequirements.mockReturnValue([
      { material: materialId, quantity: 4 }
    ]);

    StockMovement.find.mockReturnValue({
      session: jest.fn().mockResolvedValue([
        { type: "ENTREE", quantite: 10 }
      ])
    });

    StockMovement.create.mockResolvedValue([]);

    const result = await start(orderId, operatorId);

    expect(result.status).toBe("EN_COURS");
    expect(StockMovement.create).toHaveBeenCalledWith(
      [{
        matiere: materialId,
        type: "SORTIE",
        quantite: 4
      }],
      { session }
    );
    expect(order.save).toHaveBeenCalledWith({ session });
    expect(session.endSession).toHaveBeenCalled();
  });
});

describe("operatorOrderService - finish", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.isValidObjectId.mockReturnValue(true);
  });

  test("refuse un identifiant invalide", async () => {
    mongoose.isValidObjectId.mockReturnValue(false);

    await expect(finish("invalid", operatorId))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("refuse un ordre introuvable ou non affecté", async () => {
    ProductionOrder.findOne.mockResolvedValue(null);

    await expect(finish(orderId, operatorId))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  test("refuse de terminer un ordre planifié", async () => {
    ProductionOrder.findOne.mockResolvedValue({
      status: "PLANIFIE",
      save: jest.fn()
    });

    await expect(finish(orderId, operatorId))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("termine un ordre en cours", async () => {
    const order = {
      status: "EN_COURS",
      save: jest.fn().mockResolvedValue(true)
    };

    ProductionOrder.findOne.mockResolvedValue(order);

    const result = await finish(orderId, operatorId);

    expect(result.status).toBe("TERMINE");
    expect(order.save).toHaveBeenCalled();
  });
});

describe("operatorOrderService - history", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retourne l'historique et la pagination", async () => {
    const orders = [{ status: "TERMINE" }];

    ProductionOrder.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(orders)
    });

    ProductionOrder.countDocuments.mockResolvedValue(1);

    const result = await history(operatorId, {
      page: 1,
      limit: 10
    });

    expect(result.data).toEqual(orders);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    });
  });

  test("corrige les valeurs de pagination invalides", async () => {
    ProductionOrder.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    });

    ProductionOrder.countDocuments.mockResolvedValue(0);

    const result = await history(operatorId, {
      page: -2,
      limit: 500
    });

    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(100);
  });
});
