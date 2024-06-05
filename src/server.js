const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://carbonerdeveloper:EEpS0t8hrpU9Y2UQ@cluster0.pfvogjs.mongodb.net/riskitapp').then(function () {

    app.get('/', function (req, res) {
        res.json({
            message: 'Api is Working !',
        })
    })

    const roomRouter = require('./routes/Room');
    app.use('/rooms', roomRouter)


})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Server running at PORT: " + PORT);
});