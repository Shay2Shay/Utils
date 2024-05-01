const mongoose = require('mongoose');
const jwt=require("jsonwebtoken")

const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
})

adminSchema.methods.genrateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWTPRIVATEKEY,{expiresIn:"1d"})
    return token;
}

module.exports = mongoose.model('LabAdmin', adminSchema);