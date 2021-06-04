const express = require('express');
const User = require(__dirname + './../models/usuario');
const commons = require(__dirname + './../utils/common');
const upload = require(__dirname + './../utils/uploads');
const tokenFunctions = require(__dirname + '/../utils/token');
const autenticado = require(__dirname + './../utils/auth');
const Partido = require(__dirname + './../models/partido');

let router = express.Router();

router.get('/', (req, res) => {
    User.find().then(result => {
        res.status(200).send({
            resultado: result
        });
    }).catch(() => {
        res.status(500).send({ error: "No se han podido obtener los usuarios" });
    })
})

router.post('/categoria', (req, res) => {
    User.find({ categoria: req.body.categoria }).then(resultado => {
        if (resultado.length > 0) {
            res.send({ resultado: resultado });
        } else {
            res.status(400).send({ error: 'No se han encontrado árbitros en la categoría especificada' })
        }

    }).catch(err => {
        res.status(500).send({
            error: 'No se han podido obtener los árbitros'
        });
    });
});

router.get('/:id/partidos', (req, res) => {
    Partido.find({
        $or: [
            { arbitro_principal: req.params['id'] },
            { arbitro_secundario: req.params['id'] },
            { cronometrador: req.params['id'] }
        ]
    }).populate('equipo_local')
        .populate('equipo_visitante')
        .populate('arbitro_principal')
        .populate('arbitro_secundario')
        .populate('cronometrador')
        .sort({ fecha_modificacion: -1 })
        .then(x => {
            res.send({
                resultado: x
            });
        }).catch(err => {
            res.status(500).send({
                error: 'No se han podido obtener los partido del árbitro'
            });
        });
})

router.get('/me', async (req, res) => {
    try {
        let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);
        let userLogueado = await User.findById(userToken.id);
        res.status(200).send({
            resultado: userLogueado
        });
    } catch (err) {
        res.status(401).send({ error: "Error obteniendo el usuario logueado" });
    }

});

router.get('/:id', (req, res) => {
    User.findById(req.params['id']).then(x => {
        res.status(200).send({
            resultado: x
        });
    }).catch(() => {
        res.status(500).send({ error: "No se ha encontrado al usuario" });
    })
});

router.put('/:id', autenticado.privilegiosAdmin, (req, res) => {
    User.findByIdAndUpdate(req.params['id'], {
        $set: {
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            telefono: req.body.telefono,
            rol: req.body.rol,
            categoria: req.body.categoria
        }
    }).then(x => {
        res.status(200).send({
            resultado: x
        });
    }).catch(() => {
        res.status(500).send({
            error: "No se ha encontrado al usuario"
        });
    });
});

router.put('/me', (req, res) => {
    let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);
    User.findByIdAndUpdate(userToken.id, {
        $set: {
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            telefono: req.body.telefono,
            categoria: req.body.categoria
        }
    }).then(x => {
        res.status(200).send({
            resultado: x
        });
    }).catch(() => {
        res.status(500).send({
            error: "No se ha encontrado al usuario"
        });
    });
});

router.patch('/:id/password', autenticado.privilegiosAdmin, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params['id'], {
            $set: {
                password: req.body.password
            }
        });

        res.status(200).send();
    } catch (err) {
        res.status(500).send({ ok: false, error: "Error actualizando la contraseña" });
    }
});

router.patch('/me/password', async (req, res) => {
    try {
        let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);
        await User.findByIdAndUpdate(userToken.id, {
            $set: {
                password: req.body.password
            }
        });

        res.status(200).send();
    } catch (err) {
        res.status(500).send({ ok: false, error: "Error actualizando la contraseña" });
    }

});

router.patch('/me/avatar', async (req, res) => {
    try {
        let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);
        const pathFoto =  `http://${req.hostname}:8080/usuarios/${upload.storage(req.body.foto, 'usuarios')}`;
        await User.findByIdAndUpdate(userToken.id, {
            $set: {
                foto: pathFoto
            }
        });

        res.status(200).send();
    } catch (err) {
        res.status(500).send({ error: "Error actualizando el avatar" });
    }
});

router.delete('/:id', autenticado.privilegiosAdmin, async (req, res) => {
    try {
        let usuarioBorrar = await User.findById(req.params['id']);
        if (usuarioBorrar.avatar && usuarioBorrar.avatar !== '') {
            commons.deleteImagen('usuarios/' + usuarioBorrar.avatar);
        }

        usuarioBorrar = await User.findByIdAndRemove(req.params['id']);
        if (usuarioBorrar) {
            res.status(200)
                .send({ resultado: usuarioBorrar });
        }

    } catch (err) {
        res.status(500).send({
            error: "No existe el usuario/árbitro"
        });
    }

})




module.exports = router;