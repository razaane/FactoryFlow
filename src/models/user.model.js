const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email:{
        type :String,
        required :true,
        unique:true,
    },
    password :{
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["Admin","Operateur"],
        default : "Operateur",
    },
    timestamps,
});

module.exports=mongoose.model("User",userSchema);