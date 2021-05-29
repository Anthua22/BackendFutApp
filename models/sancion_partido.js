const mongoose = require('mongoose');

let SancionPartido = new mongoose.Schema({
    jugador: {
        type: String,
        require: true,
        trim: true
    },
    minuto: {
        type: String,
        require: true,
        trim: true
    },
    tarjeta: {
        require: true,
        type: String,
        enum: ['AMARILLA', 'ROJA']
    },
    motivo: {
        require: true,
        type: String,
        trim: true
    }
});

module.exports = SancionPartido;