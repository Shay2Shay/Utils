const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    age: Number
})

userSchema.methods.genrateAuthToken=function(){
    const token=jwt.sign({_id:this._id},"LAB",{expiresIn:"1d"})
    return token;
}

const userModel = mongoose.model('LabUser', userSchema);

module.exports = userModel