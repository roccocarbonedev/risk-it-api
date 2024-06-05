const express = require('express');
const router = express.Router();
const Room = require('../models/Room')


router.get('/list', async function (req, res) {
    var rooms = await Room.find();
    res.json(rooms)
})

router.post('/add', async function (req, res) {
    const newRoom = new Room({
        id: req.body.id,
        nome: req.body.nome,
        creatorId: req.body.creatorId,
        password: req.body.password,
        numberOfUsers: req.body.numberOfUsers,
        userTurnQuestion: req.body.userTurnQuestion,
    });
    await newRoom.save().then(result => {
        return res.status(201).json({
            message: 'Stanza creata con successo!',
            data: { nome: result.nome },
        });
    }).catch(err => {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            //There was a duplicate key error
            return res.status(400).json({
                message: 'Esiste già una stanza con questo nome!',
                data: { err },
            });
        }
        return res.status(400).json({
            message: "You didn't give us what we want!",
            data: { err },
        });
    });;
})


router.put('/update', async function (req, res) {
    await Room.findOneAndUpdate(
        { id: req.body.id },
        {
            nome: req.body.nome
        },
        { new: true }
    ).then(result => {
        return res.status(201).json({
            message: 'Stanza modificata con successo!',
            data: { nome: result.nome }
        });
    }).catch(err => {
        return res.status(400).json({
            message: "You didn't give us what we want!",
            data: { err },
        });
    })
})


//VEDERE COME INVIARE l'ERRORE
router.delete('/delete', async function (req, res) {

    const deleteRoom = await Room.deleteOne({ id: req.body.id })
    var response;
    try {
        response = {
            message: 'Stanza eliminata con successo!',
            room: deleteRoom,
        };
    } catch (err) {
        response = {
            message: 'Errore con eliminazione stanza!',
            room: deleteRoom,
        };
    }
    res.json(response)
})

module.exports = router;