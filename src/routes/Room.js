const express = require('express');
const router = express.Router();
const Room = require('../models/Room')
const authenticateJWT = require('../middleware/authenticateJWT')

router.get('/list', authenticateJWT, async function (req, res) {
    var rooms = await Room.find();
    rooms = rooms.reverse();
    res.json(rooms);
});


router.get('/search', authenticateJWT, async function (req, res) {
    const search = req.query.name || '';
    var rooms = await Room.find({ nome: new RegExp(search, 'i') });
    res.json(rooms);
});

router.post('/add', authenticateJWT, async function (req, res) {
    console.log(req.body);
    const newRoom = new Room({
        id: req.body.id,
        nome: req.body.nome,
        creatorRoomId: req.body.creatorRoomId,
        password: req.body.password,
        usersName: req.body.usersName,
        numberOfUsers: req.body.numberOfUsers,
        userTurnQuestion: req.body.userTurnQuestion,
        question: req.body.question,
    });
    await newRoom.save().then(result => {
        const io = req.app.get('socketio');
        io.to(result.id).emit('roomAdded', result);
        return res.status(201).json({
            message: 'Stanza aggiunta con successo!',
            data: result
        });
    }).catch(err => {
        console.log('errore: ' + err)
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({
                message: 'Esiste già una stanza con questo nome!',
                data: { err },
            });
        }
        return res.status(400).json({
            message: "Failed to add new room!",
            data: { err },
        });
    });
})

router.put('/update', authenticateJWT, async function (req, res) {
    await Room.findOneAndUpdate(
        { id: req.body.id },
        { $set: req.body },
        { new: true }
    ).then(result => {
        const io = req.app.get('socketio');
        io.to(result.id).emit('roomUpdated', result);
        return res.status(201).json({
            message: 'Stanza modificata con successo!',
            data: result
        });
    }).catch(err => {
        return res.status(400).json({
            message: "Errore durante la modifica della stanza: " + err,
            data: { err },
        });
    });
})

router.delete('/delete', authenticateJWT, async function (req, res) {
    const deleteRoom = await Room.deleteOne({ id: req.body.id })
    var response;
    try {
        const io = req.app.get('socketio');
        io.to(req.body.id).emit('roomDeleted', req.body.id);
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
