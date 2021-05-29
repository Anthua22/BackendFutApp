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
    foto: {
        require: true,
        type: String,
        trim: true
    },
    sancionado: {
        require: false,
        type: Boolean,
        default: false
    },
    dorsal:{
        require:false,
        type:String,
        trim:true
    }
});

module.exports = MiembroEquipo;