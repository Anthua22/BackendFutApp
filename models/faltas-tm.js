const mongoose = require('mongoose');

let FaltasTM = new mongoose.Schema({
    faltasPrimeraParte: {
        type: Number,
        require: true
    },
    faltasSegundaParte: {
        type: Number,
        require: true
    },
    tiempoPrimeraParte: {
        require: true,
        type: Boolean
    },
    tiempoSegundaParte: {
        require: true,
        type: Boolean
    }
});

module.exports = FaltasTM;