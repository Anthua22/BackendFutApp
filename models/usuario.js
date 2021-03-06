const mongoose = require('mongoose');

let UsuarioSchema = new mongoose.Schema({
    nombre_completo: {
        require: true,
        type: String,
        trim: true,
    },

    email: {
        require: true,
        type: String,
        trim: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        unique: true
    },

    telefono: {
        require: false,
        type: String,
        trim: true,
        match: /^[0-9]{9}$/
    },

    password: {
        require: true,
        type: String,
        trim: true,
        min: 8
    },

    foto: {
        require: true,
        type: String,
        trim: true
    },

    rol: {
        require: true,
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },

    categoria: {
        require: true,
        type: String,
        enum: ['Primera', 'Segunda', 'Segunda B', 'Tercera', 'Regional', 'Futbol Base', 'Sin Categoria'],
        default: 'Sin Categoria'
    }
});


let Usuario = mongoose.model('usuarios', UsuarioSchema);
module.exports = Usuario;