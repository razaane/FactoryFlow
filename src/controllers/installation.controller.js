const installationService = require("../services/installation.service");

async function getStatus(req,res,next) {
    try{
        const status = await installationService.getStatus();
        return res.json(status);
    }catch(err){
        next(err)
    }
}

module.exports = {getStatus}