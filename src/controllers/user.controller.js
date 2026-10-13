const userService = require("../services/user.service");

async function create(req, res, next) {
  try {
    const user = await userService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Utilisateur créé",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create };