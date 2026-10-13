const User = require("../models/user.model");

async function create(data){
    return User.create(data);
}

async function findByEmail(email){
    return User.findOne({email:email.toLowerCase()})
}
async function findById(id) {
  return User.findById(id);
}

async function findAll(filter, limit) {
  return User.find(filter).limit(limit);
}

async function count(filter) {
  return User.countDocuments(filter);
}
module.exports ={create , findByEmail,findById ,findAll , count}