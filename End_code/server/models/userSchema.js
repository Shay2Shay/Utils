const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    age: Number
})

userSchema.methods.genrateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWTPRIVATEKEY,{expiresIn:"1d"})
    return token;
}

module.exports = mongoose.model('LabUser', userSchema);