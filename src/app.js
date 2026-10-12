const express = require("express");

const app = express();

app.use(express.json());

const installationRoutes = require("./routes/installation.routes");
const notFound =require('./middlewares/notFound');
const errorHandler =require('./middlewares/errorHandler');

const authenticate = require("./middlewares/authenticate");
const authorize = require("./middlewares/authorize");

app.use("/api/installation", installationRoutes);

app.get("/test-auth", authenticate, (req, res) => {
    res.json({
        message: "Authentication réussie",
        email: req.user.email
    });
});

app.get("/test-admin", authenticate, authorize("Admin"), (req, res) => {
    res.json({
        message: "Access autorisé"
    });
});


app.use(notFound);
app.use(errorHandler);

module.exports = app;