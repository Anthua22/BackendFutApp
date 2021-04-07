const express = require('express');
const Usuario = require(__dirname + './../models/usuario');
const bcrypt = require(__dirname + './../utils/bcrypt');
const uploadImage = require(__dirname + './../utils/uploadImagen');
const fs = require('fs');
const token = require(__dirname + './../utils/token');

let router = express.Router();

router.post('/register', async (req, res) => {
    if (req.body.password && req.body.nombre_completo && req.body.email) {
        const pathFoto = uploadImage(req.body.foto, req.body.nombre_completo).fileName;
        let newUser = new Usuario({
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            categoria: req.body.categoria,
            password: await bcrypt.encriptar(req.body.password),
            rol: req.body.rol,
            avatar: pathFoto
        });
        newUser.save().then(x => {
            res.status(200).send({
                ok: true, resultado: x
            });
        }).catch(err => {
            fs.unlinkSync(__dirname + "./../uploads/images" + pathFoto);
            if (err.code === 11000) {
                res.status(400).send({
                    ok: false, error: 'El email introducido ya existe'
                });
            } else if (err.errors.email) {
                res.status(400).send({
                    ok: false, error: 'Formato de email incorrecto. Sintanxis: example@example.com'
                });
            } else if (err.errors.password) {
                res.status(400).send({
                    ok: false, error: 'La contraseña debe contener al menos 8 digitos con al menos un carácter en mayúscula, uno en minúscula, un número y algún carácter especial'
                });
            } else {
                res.status(400).send({
                    ok: false, error: 'Error introduciendo el usuario'
                });
            }
        });

    } else {
        res.status(400).send({
            ok: false, error: 'Los campos email, nombre, apellidos y contraseña son obligatorios'
        });
    }
});

router.post('/login', (req, res) => {
    Usuario.findOne({
        email: req.body.email
    }).then(x => {
        if (x) {
            bcrypt.desincriptar(req.body.password, x.password).then(bool => {
                if (bool === true) {
                    res.status(200).send({
                        ok: true, token: token.generarToken(x)
                    });
                } else {
                    res.status(401).send({
                        ok: false, error: 'Contraseña incorrecta'
                    });
                }
            });
        } else {
            res.status(401).send({
                ok: false, error: 'No se ha encontrado el usuario con el email: ' + req.body.email
            });
        }

    })
})

module.exports = router;