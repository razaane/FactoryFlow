const userRepository =require("../repositories/user.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

async function login(email,password){
    const user = userRepository.findByEmail(email);

    if(!user){
        throw new AppError("Email ou mot de passe incorrect",401);
    }
    const isPassValid = await bcrypt.compare(password,user.password);
    
    if(!isPassValid){
        throw new AppError("Email ou mot de passe incorrect",401);
    }

    const token = jwt.sign({id:user.id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "1d",}
    );
    return {token,user:{
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role,
    }}
}

module.exports ={login}