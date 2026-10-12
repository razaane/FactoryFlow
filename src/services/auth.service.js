const userRepository =require("../repositories/user.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const config = require("../config/env");

async function login(email,password){
    const user = await userRepository.findByEmail(email);

    if(!user){
        throw new AppError("Email ou mot de passe incorrect",401);
    }
    const isPassValid = await bcrypt.compare(password,user.password);
    
    if(!isPassValid){
        throw new AppError("Email ou mot de passe incorrect",401);
    }

    const token = jwt.sign({id:user._id,role:user.role},
        config.jwtSecret,
        {expiresIn: config.jwtExpiresIn,}
    );
    return {token,user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    }}
}

module.exports ={login}