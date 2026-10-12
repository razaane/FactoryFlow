const User = require("../models/user.model");

async function create(data){
    return User.create(data);
}

async function findByEmail(email){
    return User.findOne({email:email.toLowerCase()})
}
module.exports ={create , findByEmail}