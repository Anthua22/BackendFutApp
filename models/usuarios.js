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
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        unique: true
    },

    telefono:{
        type: String, 
        trim: true,
        pattern: /^[0-9]{9}$/
    },

    password: {
        require: true,
        type: String,
        trim: true,
        pattern: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
        min: 8
    },

    avatar: {
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