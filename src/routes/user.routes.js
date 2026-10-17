
const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Operateur Demo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: operateur.demo@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: "DemoPass123!"
 *               role:
 *                 type: string
 *                 enum: [Admin, Operateur]
 *                 example: Operateur
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Accès refusé
 *       409:
 *         description: Email déjà utilisé
 */


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lister les utilisateurs
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'utilisateurs par page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, Operateur]
 *         description: Filtrer par rôle
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  userController.create
);

router.get(
  "/",
  authenticate,
  authorize("Admin"),
  userController.list
);

module.exports = router;

module.exports = router;
