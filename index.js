const express = require('express');
const mongoose = require('mongoose');

//Enrutadores
const auth = require(__dirname+'/routes/auth');

// Conexión con mongo
mongoose.connect('mongodb://localhost:27017/futapp',
    { useNewUrlParser: true });


let app = express();

// Carga de middleware y enrutadores
app.use(express.json());
app.use('/auth',auth);

// Puesta en marcha del servidor
app.listen(8080);
