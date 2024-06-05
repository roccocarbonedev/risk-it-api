const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority', {
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



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running at PORT: " + PORT);
});