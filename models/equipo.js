const mongoose = require('mongoose');
const MiembroEquipo = require(__dirname + './miembroequipo');

let EquipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    escudo: {
        type: String,
        trim: true
    },
    miembros: [MiembroEquipo],
    email: {
        require: true,
        type: String,
        trim: true,
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        unique: true
    },
    categoria: {
        require: true,
        type: String,
        enum: ['Primera', 'Segunda', 'Segunda B', 'Tercera', 'Regional', 'Futbol Base', 'Sin Categoria'],
        default: 'Sin Categoria'
    },
    direccion_campo: {
        require: true,
        type: String,
        trim: true
    }


});

let Equipo = mongoose.model('equipos', EquipoSchema);
module.exports = Equipo;
