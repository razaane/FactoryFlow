
const installationRepository = require("../repositories/installation.repository");

async function getStatus(){

    const installation = await installationRepository.find();
    if (!installation) {
        return { installed: false };
    }
    return { installed: installation.installed };
}

module.exports = {getStatus}