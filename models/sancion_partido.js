const mongoose = require('mongoose');

let SancionPartido = new mongoose.Schema({
    jugador: {
        type: String,
        require:true,
        trim:true
    },
    minuto:{
        type: String,
        require: true,
        trim:true
    },
    sancion:{
        require: true,
        type:String,
        enum:['AMARILLA','ROJA']
    }
});

module.exports = SancionPartido;