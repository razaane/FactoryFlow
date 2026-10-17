
jest.mock("../src/repositories/installation.repository");
jest.mock("../src/repositories/user.repository");
jest.mock("../src/validators/installation.validator");
jest.mock("bcryptjs");

const installationRepository = require("../src/repositories/installation.repository");
const userRepository = require("../src/repositories/user.repository");
const { validateInstall } = require("../src/validators/installation.validator");
const bcrypt = require("bcryptjs");

const installationService = require("../src/services/installation.service");

describe("Installation Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const body = {
    name: "Razane",
    email: "razane@gmail.com",
    password: "password123",
  };

  test("getStatus doit retourner false si aucune installation n'existe", async () => {
    installationRepository.find.mockResolvedValue(null);

    const result = await installationService.getStatus();

    expect(result).toEqual({ installed: false });
  });

  test("getStatus doit retourner false si installed vaut false", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });

    const result = await installationService.getStatus();

    expect(result).toEqual({ installed: false });
  });

  test("getStatus doit retourner true si l'application est installée", async () => {
    installationRepository.find.mockResolvedValue({ installed: true });

    const result = await installationService.getStatus();

    expect(result).toEqual({ installed: true });
  });

  test("install doit créer un administrateur et enregistrer l'installation", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });
    validateInstall.mockReturnValue(undefined);
    bcrypt.hash.mockResolvedValue("hashed-password");

    userRepository.create.mockResolvedValue({
      id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      role: "Admin",
    });

    installationRepository.create.mockResolvedValue({ installed: true });

    const result = await installationService.install(body);

    expect(validateInstall).toHaveBeenCalledWith(body);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Razane",
      email: "razane@gmail.com",
      password: "hashed-password",
      role: "Admin",
    });

    expect(installationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ installed: true })
    );

    expect(result).toEqual({
      id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      role: "Admin",
    });
  });

  test("install doit refuser si l'application est déjà installée", async () => {
    installationRepository.find.mockResolvedValue({ installed: true });

    await expect(
      installationService.install(body)
    ).rejects.toMatchObject({
      message: "L'application est déjà installée",
      statusCode: 400,
    });

    expect(validateInstall).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  test("install doit arrêter si la validation échoue", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });

    validateInstall.mockImplementation(() => {
      throw new Error("Données invalides");
    });

    await expect(
      installationService.install(body)
    ).rejects.toThrow("Données invalides");

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  test("install doit retourner une erreur si le hash du mot de passe échoue", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });
    validateInstall.mockReturnValue(undefined);
    bcrypt.hash.mockRejectedValue(new Error("Erreur de hash"));

    await expect(
      installationService.install(body)
    ).rejects.toThrow("Erreur de hash");

    expect(userRepository.create).not.toHaveBeenCalled();
  });

  test("install doit retourner une erreur si la création de l'utilisateur échoue", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });
    validateInstall.mockReturnValue(undefined);
    bcrypt.hash.mockResolvedValue("hashed-password");
    userRepository.create.mockRejectedValue(
      new Error("Erreur création utilisateur")
    );

    await expect(
      installationService.install(body)
    ).rejects.toThrow("Erreur création utilisateur");

    expect(installationRepository.create).not.toHaveBeenCalled();
  });

  test("install doit retourner une erreur si l'enregistrement de l'installation échoue", async () => {
    installationRepository.find.mockResolvedValue({ installed: false });
    validateInstall.mockReturnValue(undefined);
    bcrypt.hash.mockResolvedValue("hashed-password");

    userRepository.create.mockResolvedValue({
      id: "user123",
      name: "Razane",
      email: "razane@gmail.com",
      role: "Admin",
    });

    installationRepository.create.mockRejectedValue(
      new Error("Erreur création installation")
    );

    await expect(
      installationService.install(body)
    ).rejects.toThrow("Erreur création installation");
  });
});
