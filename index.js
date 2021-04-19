const express = require('express');
const mongoose = require('mongoose');
const autenticado = require(__dirname+'/utils/auth');

//Enrutadores
const auth = require(__dirname+'/routes/auth');
const equipos = require(__dirname+'/routes/equipos');

// Conexión con mongo
mongoose.connect('mongodb://localhost:27017/futapp',
    { useNewUrlParser: true });


let app = express();

// Carga de middleware y enrutadores
app.use(express.json());
app.use('/auth',auth);
app.use('/equipos',autenticado,equipos);

// Puesta en marcha del servidor
app.listen(8080);
