const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    }
}


app.use(autenticado.peticionesLocalHost);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(express.static(__dirname + '/uploads/images'));
app.use(express.static(__dirname + '/uploads'));
app.use('/auth', auth);
app.use(cors());
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use('/equipos', cors(), autenticado.rutaProtegida, equipos);
app.use('/partidos', partidos);
app.use('/users', autenticado.rutaProtegida, usuarios);


// Puesta en marcha del servidor
app.listen(8080);
