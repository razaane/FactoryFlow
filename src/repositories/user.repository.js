const User = require("../models/user.model");
async function create(data){
    return User.create(data);
}
module.exports ={create}