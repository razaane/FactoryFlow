const installationService = require("../services/installation.service");

async function getStatus(res,req,next) {
    try{
        const status = await installationService.getStatus();
        return res.json(status);
    }catch(err){
        next(err)
    }
}