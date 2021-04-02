const mongoose = require('mongoose');

let UsuarioSchema = new mongoose.Schema({
    nombre: {
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
    
    password: {
        require: true,
        type: String,
        trim: true,
        pattern: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
        min: 8
    }


});

let Usuario = mongoose.model('usuarios',UsuarioSchema);
module.exports = Usuario;