const mongoose = require('mongoose')


const roomSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    nome: {
        type: String,
        unique: true,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usersName:{
        type: [String],
        required: true
    },
    numberOfUsers: {
        type: Number,
        required: true
    },
    userTurnQuestion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Room", roomSchema)