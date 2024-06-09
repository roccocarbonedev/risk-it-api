const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const socketIO = require('socket.io');
const Room = require('./models/Room');
const http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://carbonerdeveloper:EEpS0t8hrpU9Y2UQ@cluster0.pfvogjs.mongodb.net/riskitapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
}).then(() => {
    app.get('/', function (req, res) {
        res.json({
            message: "API is Working !"
        });
    });

    const roomRouter = require('./routes/Room');
    app.use('/rooms', roomRouter)
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const server = http.createServer(app);
const io = socketIO(server);

app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
