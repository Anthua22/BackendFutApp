const mongoose = require('mongoose');
const SancionPartido = require('./sancion_partido');
const moment = require('moment');


let PartidoSchema = new mongoose.Schema({
    equipo_local: { type: mongoose.Schema.Types.ObjectId, ref: 'equipos' },
    equipo_visitante: { type: mongoose.Schema.Types.ObjectId, ref: 'equipos' },
    arbitro_principal: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' },
    arbitro_secundario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' },
    cronometrador: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' },
    fecha_encuentro: {
        require: true,
        type: Date,
        min: moment().format('YYYY-MM-DD')
    },
    categoria: {
        require: true,
        type: String,
        enum: ['Primera', 'Segunda', 'Segunda B', 'Tercera', 'Regional', 'Futbol Base', 'Sin Categoria'],
        default: 'Sin Categoria'
    },
    lt: {
        type: Number,
        default: 0
    },
    ln: {
        type: Number,
        default: 0
    },
    jornada:{
        require:true,
        type: Number
    },
    resultado:{
        type: String,
        trim:true
    },
    lugar_encuentro: {
        require: false,
        type: String,
        trim: true
    },
    acta: {
        type: String,
        trim: true
    },
    fecha_modificacion: {
        require: true,
        type: Date,
        min: moment().format('YYYY-MM-DD')
    },
    sanciones_partidos:[SancionPartido]

});

let Partido = mongoose.model('partidos', PartidoSchema);
module.exports = Partido;
