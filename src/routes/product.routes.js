
const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");

const {
  validateProduct,
  validateProductList
} = require("../validators/product.validator");

const validateProductUpdate =
  require("../validators/productUpdate.validator");

const validateProductId =
  require("../validators/productId.validator");

const authenticate =
  require("../middlewares/authenticate");

const authorize =
  require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits et de leur composition
 */

router.use(authenticate, authorize("Admin"));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un produit
 *     tags: [Products]
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
 *               - composition
 *             properties:
 *               reference:
 *                 type: string
 *                 example: PROD-001
 *               name:
 *                 type: string
 *                 example: Table industrielle
 *               description:
 *                 type: string
 *                 example: Table fabriquée en acier
 *               composition:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - material
 *                     - quantity
 *                   properties:
 *                     material:
 *                       type: string
 *                       description: Identifiant MongoDB de la matière première
 *                       example: 671a1234567890abcdef1234
 *                     quantity:
 *                       type: number
 *                       exclusiveMinimum: 0
 *                       description: Quantité nécessaire pour une unité du produit
 *                       example: 2.5
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides ou composition incorrecte
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       409:
 *         description: Référence déjà utilisée
 */
router.post("/", validateProduct, controller.create);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lister les produits
 *     tags: [Products]
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
 *         description: Nombre de produits par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche de produits
 *         example: Table
 *     responses:
 *       200:
 *         description: Liste paginée des produits
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 */
router.get("/", validateProductList, controller.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Consulter un produit et sa composition
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB du produit
 *         schema:
 *           type: string
 *         example: 671a1234567890abcdef1234
 *     responses:
 *       200:
 *         description: Produit récupéré
 *       400:
 *         description: Identifiant invalide
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Produit introuvable
 */
router.get("/:id", validateProductId, controller.getById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modifier un produit et sa composition
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant MongoDB du produit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *               - name
 *               - composition
 *             properties:
 *               reference:
 *                 type: string
 *                 example: PROD-001
 *               name:
 *                 type: string
 *                 example: Table industrielle modifiée
 *               description:
 *                 type: string
 *                 example: Description du produit
 *               composition:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - material
 *                     - quantity
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 671a1234567890abcdef1234
 *                     quantity:
 *                       type: number
 *                       exclusiveMinimum: 0
 *                       example: 3
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *       400:
 *         description: Identifiant ou données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Produit introuvable
 *       409:
 *         description: Référence déjà utilisée
 */
router.put(
  "/:id",
  validateProductId,
  validateProductUpdate,
  controller.update
);

module.exports = router;
