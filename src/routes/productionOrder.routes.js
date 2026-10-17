const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/productionOrder.controller");

const authenticate =
  require("../middlewares/authenticate");

const authorize =
  require("../middlewares/authorize");

const validateCreate =
  require("../validators/productionOrder.validator");

const validateUpdate =
  require("../validators/productionOrderUpdate.validator");

const validateProductionOrderList =
  require("../validators/productionOrderList.validator");

/**
 * @swagger
 * tags:
 *   name: Production Orders
 *   description: Gestion des ordres de fabrication
 */

/**
 * @swagger
 * /api/production-orders:
 *   post:
 *     summary: Créer un ordre de fabrication
 *     tags: [Production Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *               - assignedTo
 *             properties:
 *               product:
 *                 type: string
 *                 example: "66a123456789012345678901"
 *               quantity:
 *                 type: number
 *                 example: 10
 *               assignedTo:
 *                 type: string
 *                 example: "66b123456789012345678901"
 *     responses:
 *       201:
 *         description: Ordre de fabrication créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'administrateur
 *
 *   get:
 *     summary: Lister les ordres de fabrication
 *     tags: [Production Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLANIFIE, EN_COURS, TERMINE, ANNULE]
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des ordres de fabrication
 *       400:
 *         description: Filtres invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'administrateur
 */

/**
 * @swagger
 * /api/production-orders/{id}:
 *   put:
 *     summary: Modifier un ordre de fabrication planifié
 *     tags: [Production Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'ordre de fabrication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 12
 *               assignedTo:
 *                 type: string
 *                 example: "66b123456789012345678901"
 *     responses:
 *       200:
 *         description: Ordre de fabrication modifié
 *       400:
 *         description: Données invalides ou ordre non modifiable
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'administrateur
 *       404:
 *         description: Ordre introuvable
 */

/**
 * @swagger
 * /api/production-orders/{id}/cancel:
 *   post:
 *     summary: Annuler un ordre de fabrication planifié
 *     tags: [Production Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ordre de fabrication annulé
 *       400:
 *         description: Ordre impossible à annuler
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'administrateur
 *       404:
 *         description: Ordre introuvable
 */

router.use(
  authenticate,
  authorize("Admin")
);

router.post(
  "/",
  validateCreate,
  controller.create
);

router.put(
  "/:id",
  validateUpdate,
  controller.update
);

router.post(
  "/:id/cancel",
  controller.cancel
);

router.get(
  "/",
  validateProductionOrderList,
  controller.list
);

module.exports = router;