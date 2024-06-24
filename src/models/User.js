const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    picture: {
        type: String,
    }
})

module.exports = mongoose.model("user", userSchema)