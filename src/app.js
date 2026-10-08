const express = require("express");

const app = express();
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const installationRoutes = require("./routes/installation.routes");


app.use(express.json());
app.use("/api/installation",installationRoutes);



app.use(notFound);
app.use(errorHandler);
module.exports = app;