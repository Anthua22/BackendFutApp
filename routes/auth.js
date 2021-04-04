const express = require('express');
const Usuario = require(__dirname + './../models/usuarios');
const bcrypt = require(__dirname+'./../utils/bcrypt');
const uploadImage = require(__dirname+'./../utils/uploadImagen');

let router = express.Router();

router.post('/register', (req, res) => {
    let newUser = new Usuario({
        nombre_completo: req.body.nombre_completo,
        email: req.body.nombre_completo,
        categoria: req.body.categoria,
        password: bcrypt.encriptar(req.body.password)
    })
})