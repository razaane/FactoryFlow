
jest.mock("../src/repositories/user.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const userRepository = require("../src/repositories/user.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../src/config/env");

const { login } = require("../src/services/auth.service");

describe("Auth Service - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("doit connecter un utilisateur avec des identifiants corrects", async () => {
    const user = {
      _id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      password: "hashed-password",
      role: "Admin",
    };

    userRepository.findByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");

    const result = await login("razane@gmail.com", "password123");

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "razane@gmail.com"
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user123", role: "Admin" },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    expect(result).toEqual({
      token: "fake-token",
      user: {
        id: "user123",
        name: "Razane",
        email: "razane@gmail.com",
        role: "Admin",
      },
    });
  });

  test("doit refuser si l'email n'existe pas", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      login("inconnu@gmail.com", "password123")
    ).rejects.toMatchObject({
      message: "Email ou mot de passe incorrect",
      statusCode: 401,
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("doit refuser si le mot de passe est incorrect", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      password: "hashed-password",
      role: "Admin",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      login("razane@gmail.com", "wrong-password")
    ).rejects.toMatchObject({
      message: "Email ou mot de passe incorrect",
      statusCode: 401,
    });

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("ne doit pas retourner le mot de passe dans le résultat", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      password: "hashed-password",
      role: "Admin",
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");

    const result = await login("razane@gmail.com", "password123");

    expect(result.user).not.toHaveProperty("password");
  });
});
