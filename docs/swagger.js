
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "FactoryFlow API",
      version: "1.0.0",
      description:
        "API sécurisée de gestion des matières premières, des stocks et des ordres de fabrication.",
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Serveur local de développement",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrer le token JWT obtenu après authentification.",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Une erreur est survenue",
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Opération réussie",
            },
            data: {
              type: "object",
              additionalProperties: true,
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
