const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, min:3, max:20},
    email: {type: String, required: true, unique: true, max:50},
    password: {type: String, required: true, min:8},
    isAvatarImageSet: {type: Boolean, default: false},
    avatarImage: {type:String, default:""}
})

const userModel = mongoose.model('User', userSchema);

module.exports = {
    userModel
}