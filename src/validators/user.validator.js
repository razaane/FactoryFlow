const AppError = require("../utils/AppError");

function validateCreateUser(body = {}) {
    const { name, email, password, role } = body;

    if (!name || name.trim().length < 2) {
        throw new AppError("Nom invalide", 400);
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
        throw new AppError("Email invalide", 400);
    }

    if (!password ||password.length < 8 ||password.length > 72 ||password !== password.trim()) {
        throw new AppError("Mot de passe invalide", 400);
    }

    if (!["Admin", "Operateur"].includes(role)) {
        throw new AppError("Rôle invalide", 400);
    }
}

module.exports = { validateCreateUser };