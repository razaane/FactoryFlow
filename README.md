# FactoryFlow

**Secure REST API for Industrial Stock and Production Management**

FactoryFlow is a backend application designed to help an industrial company manage raw materials, stock movements, products, and manufacturing orders through a centralized and secure REST API.

The application replaces scattered stock and production records with a structured system that tracks material quantities, validates stock availability, and manages the production lifecycle.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Production Workflow](#production-workflow)
- [Stock Management](#stock-management)
- [Testing](#testing)
- [Security](#security)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Future Improvements](#future-improvements)

## Features

### Authentication and Authorization
- User authentication using JSON Web Tokens (JWT).
- Password hashing with bcrypt.
- Protected routes using authentication and authorization middleware.
- Role-based access control for administrators and operators.
- User profile retrieval and user management.

### Installation
- Check the installation status.
- Initialize the application through the installation endpoint.

### Raw Material Management
- Create and manage raw materials.
- Assign a unique reference to each material.
- Define the unit of measurement and stock alert threshold.
- Register initial stock.
- Retrieve material details and paginated lists.
- Update material information.
- Detect materials whose stock reaches or falls below the alert threshold.

### Stock Management
- Record stock entries.
- Track stock movements using `ENTREE` and `SORTIE`.
- Calculate available quantities from the initial stock and recorded movements.
- Filter movements by material, type, and date range.
- Retrieve paginated movement history, sorted from newest to oldest.

### Product Management
- Create products with their raw-material composition.
- Define the quantity of each material required to manufacture one product unit.
- Validate material references and composition quantities.
- Prevent duplicate product references and duplicate materials in a composition.
- Retrieve product details and paginated product lists.
- Search products by reference or name.

### Production Order Management
- Create production orders for products and assign them to operators.
- Store a snapshot of the product composition when an order is created.
- Update eligible planned orders.
- Filter orders by status, product, and date range.
- Cancel planned orders.
- Calculate material requirements for an order.
- Check stock availability before starting production.
- Record material consumption through stock-out movements.
- Prevent an order from being started more than once.
- Allow operators to view their assigned orders, start production, finish orders, and consult completed-order history.

## Technologies

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and routing |
| MongoDB | NoSQL database |
| Mongoose | Database models and queries |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin resource configuration |
| Morgan | HTTP request logging |
| Swagger / OpenAPI | API documentation |
| Jest | Automated tests |
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |

## Architecture

FactoryFlow follows a layered architecture that separates HTTP handling, business logic, database access, and validation.

```text
Client (Postman / Swagger UI)
              |
              v
        Express Routes
              |
              v
 Authentication / Authorization
              |
              v
           Validators
              |
              v
          Controllers
              |
              v
           Services
              |
              v
         Repositories
              |
              v
        Mongoose Models
              |
              v
           MongoDB
```

**Main layers:**

- **Routes:** Define API endpoints and connect middleware to controllers.
- **Middlewares:** Handle authentication and role-based access control.
- **Validators:** Validate incoming request data.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Implement business rules and workflows.
- **Repositories:** Encapsulate database queries where applicable.
- **Models:** Define MongoDB document structures using Mongoose.

This separation improves maintainability, testability, and code organization.

## Prerequisites

For local development without Docker, install:

- Node.js 20 or a compatible version.
- npm.
- MongoDB configured for the application's database connection.

For the Docker setup, install Docker Engine and the Docker Compose plugin.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd FactoryFlow
```

Replace `<YOUR_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use the following values as a development example and adjust them to match the actual application configuration.

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/factoryflow
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

**Important:** Never commit your `.env` file or real secrets to Git. The MongoDB connection string must match your chosen database configuration. When using Docker Compose with the configured replica set, use the internal MongoDB service hostname and replica-set parameters instead of the local connection string above.

### 4. Start the application

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API uses port `3000` inside the application by default, unless overridden by the environment configuration.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `NODE_ENV` | Application environment |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | JWT expiration duration, for example `1d` |

Keep the values consistent with the project's configuration files and Docker Compose setup.

## Running with Docker

FactoryFlow provides Docker Compose services for the API and MongoDB.

Start the application:

```bash
docker compose up --build
```

Run the services in the background:

```bash
docker compose up --build -d
```

Display running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f api
```

View MongoDB logs:

```bash
docker compose logs -f mongo
```

Stop the services:

```bash
docker compose down
```

In the current local development setup, the API is exposed on host port `3001`, mapped to container port `3000`. MongoDB is exposed on host port `27018`, mapped to container port `27017`.

The API base URL is therefore:

```text
http://localhost:3001
```

The internal MongoDB connection used by the API should target the Compose service hostname, not `localhost` inside the API container.

## API Documentation

Swagger UI provides an interactive interface for exploring and testing documented endpoints.

Once the application is running, open:

**http://localhost:3001/api-docs/**

The API documentation uses the OpenAPI specification and Swagger JSDoc annotations in route files.

For protected endpoints:

1. Authenticate using the login endpoint.
2. Copy the JWT returned by the API.
3. Click **Authorize** in Swagger UI.
4. Enter the token using the Bearer authentication scheme.
5. Execute the protected requests.

Only endpoints present in the generated OpenAPI specification will appear in Swagger UI.

## API Endpoints

The following table summarizes the main API routes. Requests requiring authentication must include a valid JWT. Administrative endpoints require the `Admin` role, while operator endpoints require the `Operateur` role.

### Installation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/installation/status` | Check installation status |
| POST | `/api/installation` | Initialize the application |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user's profile |

### Users — Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Create a user |
| GET | `/api/users` | List users |

### Raw Materials — Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/raw-materials` | Create a raw material and register initial stock |
| GET | `/api/raw-materials` | List raw materials |
| GET | `/api/raw-materials/alerts` | Retrieve low-stock alerts |
| GET | `/api/raw-materials/:id` | Retrieve a material by ID |
| PUT | `/api/raw-materials/:id` | Update material information |
| POST | `/api/raw-materials/:id/stock-entries` | Register a stock entry |

### Stock Movements — Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stock-movements` | List and filter stock movements |

Supported query filters include `material`, `type`, `from`, `to`, `page`, and `limit`.

### Products — Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product and define its composition |
| GET | `/api/products` | List and search products |
| GET | `/api/products/:id` | Retrieve product details |
| PUT | `/api/products/:id` | Update a product |

### Production Orders — Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/production-orders` | Create a production order |
| GET | `/api/production-orders` | List and filter production orders |
| PUT | `/api/production-orders/:id` | Update an eligible planned order |
| POST | `/api/production-orders/:id/cancel` | Cancel a planned order |

### Operator Orders — Operator

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/operator/orders` | List assigned production orders |
| GET | `/api/operator/orders/history` | Retrieve completed-order history |
| GET | `/api/operator/orders/:id` | Retrieve an assigned order |
| POST | `/api/operator/orders/:id/start` | Start production |
| POST | `/api/operator/orders/:id/finish` | Finish production |

**Notes:**
- IDs in URL paths are MongoDB document IDs.
- List endpoints may support pagination and filters.
- Request validation and permissions depend on the endpoint.
- Consult Swagger UI for the documented request bodies, query parameters, and responses.

## Production Workflow

Production orders follow a defined lifecycle:

```text
           Create Order
                |
                v
            PLANIFIE
             /     \
            /       \
      Start Order   Cancel Order
          |              |
          v              v
       EN_COURS         ANNULE
          |
          v
        TERMINE
```

### Starting an order

When an operator starts a planned order, the application:

1. Checks that the order exists and is assigned to the operator.
2. Verifies that the order is in the `PLANIFIE` state.
3. Calculates the required quantities of raw materials.
4. Checks the availability of all required materials before deducting stock.
5. Records the corresponding `SORTIE` movements and updates the order status to `EN_COURS`.

If the available stock is insufficient, production must not proceed with a partial stock deduction.

### Finishing an order

An order can be completed when it is in the `EN_COURS` state. After successful completion, its status becomes `TERMINE`.

A completed or cancelled order cannot be treated as a new planned order without following the application's business rules.

## Stock Management

FactoryFlow tracks stock through an initial quantity and recorded movements.

The available quantity is calculated using the stock ledger:

```text
Available Stock = Initial Stock
                + Total Stock Entries
                - Total Stock Exits
```

The two movement types are:

- `ENTREE`: Adds stock.
- `SORTIE`: Records stock consumed by production.

This approach provides a history of stock changes instead of relying solely on a manually edited quantity field.

A stock alert is triggered when the available quantity reaches or falls below the material's configured alert threshold.

## Testing

FactoryFlow uses Jest for automated service tests.

Run the complete test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

The tests cover the application's business logic, including authentication, installation, users, products, raw materials, stock management, requirements calculation, and production orders.

A previously verified project run reported **99 passing tests across 9 suites**, with approximately **83.4% overall coverage**. Coverage and test counts can change as the codebase evolves, so rerun the commands above to obtain the current results.

## Security

The API includes several security measures:

- JWT-based authentication.
- Role-based authorization.
- Password hashing with bcrypt.
- Request validation.
- Helmet security headers.
- Centralized error handling.
- Protected administrative and operator routes.
- Environment-based configuration for secrets.

Never expose JWT secrets, passwords, database credentials, or real tokens in source control, screenshots, logs, or public documentation.

## Project Structure

The project follows a modular structure. The main directories include:

```text
FactoryFlow/
├── docs/
│   └── swagger.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .gitignore
├── compose.yaml
├── Dockerfile
├── package.json
└── README.md
```

The exact files may vary according to the final repository version. The `.env` file should remain local and must not be committed.

## Error Handling

The API uses HTTP status codes to indicate the outcome of requests. Common responses include:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid input or business-rule violation |
| `401 Unauthorized` | Authentication is missing or invalid |
| `403 Forbidden` | Authenticated user lacks permission |
| `404 Not Found` | Requested resource does not exist |
| `409 Conflict` | Resource conflicts with existing data |
| `500 Internal Server Error` | Unexpected server error |

Error responses generally include a message describing the problem.

## Future Improvements

Potential future improvements include:

- Completing and verifying Swagger documentation for every endpoint.
- Providing a reproducible demo-data setup and Postman collection.
- Adding integration tests for complete API workflows.
- Improving reporting and stock-consumption analytics.
- Adding deployment configuration and operational monitoring.

## Author

Developed as an industrial API project focused on secure backend development, stock traceability, and production-order management.

**Project:** FactoryFlow  
**Backend:** Node.js, Express.js, MongoDB  
**API style:** REST  
**Documentation:** Swagger / OpenAPI  
**Testing:** Jest