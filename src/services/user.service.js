
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const {
  validateCreateUser,
  validateListQuery
} = require("../validators/user.validator");
const AppError = require("../utils/AppError");

async function create(body) {
  validateCreateUser(body);

  const email = body.email.trim().toLowerCase();
  const existing = await userRepository.findByEmail(email);

  if (existing) {
    throw new AppError("Cet email est déjà utilisé", 409);
  }

  const password = await bcrypt.hash(body.password, 10);

  try {
    const user = await userRepository.create({
      name: body.name.trim(),
      email,
      password,
      role: body.role,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Cet email est déjà utilisé", 409);
    }

    throw err;
  }
}

async function list(query) {
  const { page, limit, role } = validateListQuery(query);
  const filter = role ? { role } : {};

  const users = await userRepository.findAll(filter, limit);
  const total = await userRepository.count(filter);

  return {
    items: users,
    page,
    limit,
    total
  };
}

module.exports = { create  ,list};