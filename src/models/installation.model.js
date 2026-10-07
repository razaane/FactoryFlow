const { boolean } = require("joi");
const mongoose = require("mongoose");
const installationSchema = new mongoose.Schema({
    installed :{type : boolean , default :false},
    installedAt :{type:Date},
    timestamps: true ,
});
module.exports =mongoose.model("Installation" , installationSchema);
