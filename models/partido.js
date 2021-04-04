const mongoose = require('mongoose');
const moment = require('moment');

//const Equipo= require(__dirname + './equipo');
const Usuario = require(__dirname + './usuarios');


let PartidoSchema = new mongoose.Schema({
    equipo_local: Equipo,
    equipo_visitante: Equipo,
    arbitros: [Usuario], //Coloque este campo como array ya que dependiendo la categoría el número de árbitros varía
    fecha: {
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

    lugar_encuentro: {
        require: false,
        type: String,
        trim:true
    },

    acta:{
        type:String,
        trim:true
    }

});

let Partido = mongoose.model('partidos',PartidoSchema);
module.exports = Partido;
