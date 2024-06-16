const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("user", userSchema)