const express = require('express');
const mongoose = require('mongoose');
const autenticado = require(__dirname + '/utils/auth');

//Enrutadores
const auth = require(__dirname + '/routes/auth');
const equipos = require(__dirname + '/routes/equipos');
const partidos = require(__dirname + '/routes/partidos');
const usuarios = require(__dirname + '/routes/usuarios');

// Conexión con mongo
mongoose.connect('mongodb://localhost:27017/futapp',
    { useNewUrlParser: true });


let app = express();

// Carga de middleware y enrutadores
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(autenticado.peticionesLocalHost);
app.use('/auth', auth);
app.use('/equipos', autenticado.rutaProtegida, equipos);
app.use('/partidos', partidos);
app.use('/usuarios', autenticado.rutaProtegida, usuarios);


// Puesta en marcha del servidor
app.listen(8080);
