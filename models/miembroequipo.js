const mongoose = require('mongoose');

let MiembroEquipo = new mongoose.Schema({
    nombre_completo: {
        require: true,
        type: String,
        trim: true
    },

    rol: {
        require: true,
        type: String,
        enum: ['JUGADOR', 'ENTRENADOR', 'DELEGADO', 'ENCARGADO_MATERIAL', 'PREPARADOR_FISICO']
    },

    sancionado: {
        require: false,
        type: Boolean,
        default: false
    }
});

module.exports = MiembroEquipo;