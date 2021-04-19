const express = require('express');
const Usuario = require(__dirname + './../models/usuario');
const bcrypt = require(__dirname + './../utils/bcrypt');
const uploadImage = require(__dirname + './../utils/uploadImagen');
const commons = require(__dirname+'./../utils/common');
const token = require(__dirname + './../utils/token');
const common  = require('./../utils/common')

let router = express.Router();

router.post('/register', async (req, res) => {
    if (req.body.password && req.body.nombre_completo && req.body.email) {
        const pathFoto = uploadImage(req.body.foto, req.body.nombre_completo,'usuarios').fileName;
        let newUser = new Usuario({
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            categoria: req.body.categoria,
            password: await bcrypt.encriptar(req.body.password),
            rol: req.body.rol,
            avatar: pathFoto
        });
        newUser.save().then(x => {
            res.status(201).send({
                ok: true, resultado: x
            });
        }).catch(err => {
            commons.deleteImagen('usuarios/'+pathFoto);
            commons.checkErrors(err, res);
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
});

router.post('/google',(req, res)=>{

})


function getGoogleAuthURL() {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes, // If you only need one scope you can pass it as string
    });
  }
module.exports = router;