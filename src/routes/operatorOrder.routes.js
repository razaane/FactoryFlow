
const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/operatorOrder.controller");

const authenticate =
  require("../middlewares/authenticate");

const authorize =
  require("../middlewares/authorize");

const validateOperatorOrderList =
  require("../validators/operatorOrderList.validator");

/**
 * @swagger
 * tags:
 *   name: Operator Orders
 *   description: Gestion des ordres de fabrication par l'opérateur
 */

/**
 * @swagger
 * /api/operator/orders:
 *   get:
 *     summary: Consulter les ordres de l'opérateur connecté
 *     tags: [Operator Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLANIFIE, EN_COURS, TERMINE, ANNULE]
 *         description: Filtrer par statut
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
 *         description: Liste des ordres de l'opérateur
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'opérateur
 */

/**
 * @swagger
 * /api/operator/orders/{id}:
 *   get:
 *     summary: Consulter un ordre assigné à l'opérateur
 *     tags: [Operator Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ordre
 *     responses:
 *       200:
 *         description: Détails de l'ordre
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ordre introuvable ou non assigné à l'opérateur
 */

/**
 * @swagger
 * /api/operator/orders/{id}/start:
 *   post:
 *     summary: Démarrer un ordre de fabrication
 *     tags: [Operator Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ordre à démarrer
 *     responses:
 *       200:
 *         description: Ordre démarré et sorties de stock enregistrées
 *       400:
 *         description: Ordre non planifié ou stock insuffisant
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'opérateur
 *       404:
 *         description: Ordre introuvable ou non assigné
 */

/**
 * @swagger
 * /api/operator/orders/{id}/finish:
 *   post:
 *     summary: Terminer un ordre de fabrication
 *     tags: [Operator Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'ordre à terminer
 *     responses:
 *       200:
 *         description: Ordre terminé
 *       400:
 *         description: L'ordre n'est pas en cours
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'opérateur
 *       404:
 *         description: Ordre introuvable ou non assigné
 */

/**
 * @swagger
 * /api/operator/orders/history:
 *   get:
 *     summary: Consulter l'historique des ordres terminés
 *     tags: [Operator Orders]
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
 *         description: Historique paginé des ordres terminés
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé à l'opérateur
 */

router.use(
  authenticate,
  authorize("Operateur")
);

router.get(
  "/",
  validateOperatorOrderList,
  controller.list
);

router.get(
  "/history",
  controller.history
);

router.get(
  "/:id",
  controller.getById
);

router.post(
  "/:id/start",
  controller.start
);

router.post(
  "/:id/finish",
  controller.finish
);

module.exports = router;
