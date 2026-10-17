
const express = require("express");

const router = express.Router();

const controller = require("../controllers/stockMovement.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  validateListMovements
} = require("../validators/stockMovement.validator");

/**
 * @swagger
 * tags:
 *   name: Stock Movements
 *   description: Consultation de l'historique des mouvements de stock
 */

/**
 * @swagger
 * /api/stock-movements:
 *   get:
 *     summary: Consulter les mouvements de stock
 *     description: >
 *       Retourne l'historique des entrées et sorties de stock.
 *       L'accès est réservé aux administrateurs.
 *     tags: [Stock Movements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: material
 *         required: false
 *         description: Identifiant de la matière première
 *         schema:
 *           type: string
 *         example: 671a1234567890abcdef1234
 *       - in: query
 *         name: type
 *         required: false
 *         description: Type de mouvement
 *         schema:
 *           type: string
 *           enum: [ENTREE, SORTIE]
 *         example: ENTREE
 *       - in: query
 *         name: from
 *         required: false
 *         description: Date de début du filtre
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-10-01"
 *       - in: query
 *         name: to
 *         required: false
 *         description: Date de fin du filtre
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-10-21"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Numéro de page, à partir de 1
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Nombre de résultats par page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Liste des mouvements récupérée
 *       400:
 *         description: Paramètres de recherche invalides
 *       401:
 *         description: Authentification requise ou token invalide
 *       403:
 *         description: Accès réservé aux administrateurs
 */
router.use(authenticate, authorize("Admin"));

router.get("/", validateListMovements, controller.list);

module.exports = router;
