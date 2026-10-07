const app = require("./app");
const config = require("./config/env");
const connectDB = require("./config/db");

async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`FactoryFlow running on port ${config.port}`);
  });
}

start();