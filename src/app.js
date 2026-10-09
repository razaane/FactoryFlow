const express = require("express");

const app = express();

app.use(express.json());

const installationRoutes = require("./routes/installation.routes");
const notFound =require('./middlewares/notFound');
const errorHandler =require('./middlewares/errorHandler')

app.use("/api/installation", installationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;