const installationRepository = require("../repositories/installation.repository");

async function getStatus() {
  const installation = await installationRepository.find();

  return {
    installed: Boolean(installation && installation.installed)
  };
}

module.exports = { getStatus };