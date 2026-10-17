
jest.mock("../src/repositories/user.repository");
jest.mock("../src/validators/user.validator");
jest.mock("bcryptjs");

const userRepository = require("../src/repositories/user.repository");
const { validateCreateUser, validateListQuery } = require("../src/validators/user.validator");
const bcrypt = require("bcryptjs");

const userService = require("../src/services/user.service");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("doit créer un utilisateur avec un mot de passe hashé", async () => {
      validateCreateUser.mockReturnValue(undefined);
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");

      userRepository.create.mockResolvedValue({
        _id: "user123",
        name: "Razane",
        email: "razane@gmail.com",
        role: "Operateur",
        createdAt: new Date("2026-10-21"),
      });

      const body = {
        name: " Razane ",
        email: " RAZANE@GMAIL.COM ",
        password: "password123",
        role: "Operateur",
      };

      const result = await userService.create(body);

      expect(validateCreateUser).toHaveBeenCalledWith(body);
      expect(userRepository.findByEmail).toHaveBeenCalledWith("razane@gmail.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

      expect(userRepository.create).toHaveBeenCalledWith({
        name: "Razane",
        email: "razane@gmail.com",
        password: "hashed-password",
        role: "Operateur",
      });

      expect(result).toMatchObject({
        id: "user123",
        name: "Razane",
        email: "razane@gmail.com",
        role: "Operateur",
      });

      expect(result).not.toHaveProperty("password");
    });

    test("doit refuser un email déjà utilisé", async () => {
      validateCreateUser.mockReturnValue(undefined);
      userRepository.findByEmail.mockResolvedValue({
        email: "razane@gmail.com",
      });

      await expect(
        userService.create({
          name: "Razane",
          email: "razane@gmail.com",
          password: "password123",
          role: "Operateur",
        })
      ).rejects.toMatchObject({
        message: "Cet email est déjà utilisé",
        statusCode: 409,
      });

      expect(userRepository.create).not.toHaveBeenCalled();
    });

    test("doit convertir une erreur MongoDB duplicate key en erreur 409", async () => {
      validateCreateUser.mockReturnValue(undefined);
      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-password");

      userRepository.create.mockRejectedValue({
        code: 11000,
      });

      await expect(
        userService.create({
          name: "Razane",
          email: "razane@gmail.com",
          password: "password123",
          role: "Operateur",
        })
      ).rejects.toMatchObject({
        message: "Cet email est déjà utilisé",
        statusCode: 409,
      });
    });
  });

  describe("list", () => {
    test("doit retourner les utilisateurs avec pagination et filtre par rôle", async () => {
      validateListQuery.mockReturnValue({
        page: 2,
        limit: 5,
        role: "Operateur",
      });

      const users = [
        { name: "User 1", role: "Operateur" },
        { name: "User 2", role: "Operateur" },
      ];

      userRepository.findAll.mockResolvedValue(users);
      userRepository.count.mockResolvedValue(7);

      const result = await userService.list({
        page: "2",
        limit: "5",
        role: "Operateur",
      });

      expect(userRepository.findAll).toHaveBeenCalledWith(
        { role: "Operateur" },
        5
      );
      expect(userRepository.count).toHaveBeenCalledWith({
        role: "Operateur",
      });

      expect(result).toEqual({
        items: users,
        page: 2,
        limit: 5,
        total: 7,
      });
    });

    test("doit retourner tous les rôles si aucun filtre n'est fourni", async () => {
      validateListQuery.mockReturnValue({
        page: 1,
        limit: 10,
        role: undefined,
      });

      userRepository.findAll.mockResolvedValue([]);
      userRepository.count.mockResolvedValue(0);

      const result = await userService.list({});

      expect(userRepository.findAll).toHaveBeenCalledWith({}, 10);
      expect(userRepository.count).toHaveBeenCalledWith({});
      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });
});
