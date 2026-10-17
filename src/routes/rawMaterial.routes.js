
const express = require("express");
const router = express.Router();

const controller = require("../controllers/rawMaterial.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Raw Materials
 *   description: Gestion des matières premières et du stock
 */

router.use(authenticate, authorize("Admin"));

/**
 * @swagger
 * /api/raw-materials:
 *   post:
 *     summary: Créer une matière première
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *               - name
 *               - unit
 *               - stockInitial
 *             properties:
 *               reference:
 *                 type: string
 *                 example: MAT-001
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Acier
 *               unit:
 *                 type: string
 *                 enum: [kg, g, L, mL, unité, m]
 *                 example: kg
 *               stockInitial:
 *                 type: number
 *                 minimum: 0
 *                 example: 100
 *               alertThreshold:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 example: 20
 *     responses:
 *       201:
 *         description: Matière première créée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       409:
 *         description: Référence déjà utilisée
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/raw-materials:
 *   get:
 *     summary: Lister les matières premières
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginée des matières premières avec leur quantité disponible
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 */
router.get("/", controller.list);

/**
 * @swagger
 * /api/raw-materials/alerts:
 *   get:
 *     summary: Consulter les alertes de stock
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matières premières sous leur seuil d'alerte
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 */
router.get("/alerts", controller.getAlerts);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   get:
 *     summary: Obtenir une matière première par son identifiant
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB de la matière première
 *     responses:
 *       200:
 *         description: Matière première récupérée
 *       400:
 *         description: Identifiant invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Matière première introuvable
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   put:
 *     summary: Modifier une matière première
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *                 example: MAT-002
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Acier inoxydable
 *               unit:
 *                 type: string
 *                 enum: [kg, g, L, mL, unité, m]
 *                 example: kg
 *               alertThreshold:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *     responses:
 *       200:
 *         description: Matière première modifiée
 *       400:
 *         description: Identifiant ou données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Matière première introuvable
 *       409:
 *         description: Référence déjà utilisée
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /api/raw-materials/{id}/stock-entries:
 *   post:
 *     summary: Enregistrer une entrée de stock
 *     tags: [Raw Materials]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB de la matière première
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 50
 *     responses:
 *       201:
 *         description: Entrée de stock enregistrée
 *       400:
 *         description: Quantité ou identifiant invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Matière première introuvable
 */
router.post("/:id/stock-entries", controller.addStockEntry);

module.exports = router;
