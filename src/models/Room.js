const mongoose = require('mongoose')


const voteSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    vote: {
        type: Number
    }
})

const questionSchema = mongoose.Schema({
    id: {
        type: String,
    },
    textQuestion: {
        type: String,
    },
    creatorQuestionId: {
        type: String,
    },
    rageOfRisk: {
        type: [Number],

    },
    votesList: {
        type: [voteSchema],
        default: null,
    }
})


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
    creatorRoomId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usersName: {
        type: [String],
        required: true
    },
    numberOfUsers: {
        type: Number,
        required: true
    },
    userTurnQuestion: {
        type: String,

    },
    question: {
        type: questionSchema,
    }

})

module.exports = mongoose.model("Room", roomSchema)