const express = require('express');
const Usuario = require(__dirname + './../models/usuario');
const bcrypt = require(__dirname + './../utils/bcrypt');
const upload = require(__dirname + './../utils/uploads');
const commons = require(__dirname + './../utils/common');
const token = require(__dirname + './../utils/token');
const OAuth2Client = require('google-auth-library');


let router = express.Router();

router.post('/register', async (req, res) => {
    let pathFoto = `http://${req.hostname}:8080/usuarios/`;
    if (req.body.password && req.body.nombre_completo && req.body.email) {
        pathFoto += upload.storage(req.body.foto, 'usuarios').fileName;
        let newUser = new Usuario({
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            categoria: req.body.categoria,
            password: await bcrypt.encriptar(req.body.password),
            rol: req.body.rol,
            foto: pathFoto
        });
        newUser.save().then(x => {
            res.status(201).send({
                resultado: x
            });
        }).catch(err => {
            commons.deleteImagen('usuarios/' + pathFoto);
            commons.checkErrors(err, res);
        });

    } else {
        res.status(400).send({
            ok: false, error: 'Los campos email, nombre, apellidos y contraseña son obligatorios'
        });
    }
});

router.post('/login', (req, res) => {
    console.log(`http://${req.hostname}:8080/uploads/images/1618835767103_Anthony Ubillus.jpeg`)
    Usuario.findOne({
        email: req.body.email
    }).then(x => {
        if (x) {
            bcrypt.desincriptar(req.body.password, x.password).then(bool => {
                if (bool === true) {
                    res.status(200).send({
                        token: token.generarToken(x)
                    });
                    req.session.user = x;
                } else {
                    res.status(401).send({
                        error: 'Contraseña incorrecta'
                    });
                }
            });
        } else {
            res.status(401).send({
                error: 'No se ha encontrado el usuario con el email: ' + req.body.email
            });
        }

    }).catch(err => {
        res.status(500).send({
            error: 'Error al loguearse'
        });
    })
});

router.post('/google', async (req, res) => {
    try {
        const client = new OAuth2Client(commons.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: req.body.token,
            audience: commons.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        if (email) {
            let User = new Usuario({
                nombre_completo: payload.name,
                email: payload.email,
                password: await bcrypt.encriptar(''),
                foto: payload.picture
            });

            let newUser = await User.save();

            res.status(201).send({
                token: token.generarToken(newUser)
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'No se ha podido loguear con google'
        });
    }

})



module.exports = router;