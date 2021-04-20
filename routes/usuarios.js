const express = require('express');
const User = require(__dirname + './../models/usuario');
const commons = require(__dirname + './../utils/common');
const upload = require(__dirname + './../utils/uploads');
const tokenFunctions = require(__dirname + '/../utils/token');
const autenticado = require(__dirname + './../utils/auth');


let router = express.Router();

router.get('/', (req, res) => {
    User.find().then(result => {
        res.status(200).send({
            ok: true, resultado: result
        });
    }).catch(() => {
        res.status(500).send({ ok: false, error: "No se han podido obtener los usuarios" });
    })
})


router.get('/me', async (req, res) => {
    try {
        let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);
        let userLogueado = await User.findById(userToken.id);

        res.status(200).send({
            ok: true, resultado: userLogueado
        });
    } catch (err) {
        res.status(500).send({ ok: false, error: "Error obteniendo el usuario logueado" });
    }

});

router.get('/:id', (req, res) => {
    User.findById(req.params['id']).then(x => {
        res.status(200).send({
            ok: true, resultado: x
        });
    }).catch(() => {
        res.status(500).send({ ok: false, error: "No se ha encontrado al usuario" });
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
            ok: true, resultado: x
        });
    }).catch(() => {
        res.status(500).send({
            ok: false, error: "No se ha encontrado al usuario"
        });
    });
});

router.put('/me', (req, res) => {
    User.findByIdAndUpdate(req.params['id'], {
        $set: {
            nombre_completo: req.body.nombre_completo,
            email: req.body.email,
            telefono: req.body.telefono,
            categoria: req.body.categoria
        }
    }).then(x => {
        res.status(200).send({
            ok: true, resultado: x
        });
    }).catch(() => {
        res.status(500).send({
            ok: false, error: "No se ha encontrado al usuario"
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

        res.status(200).send({
            ok: true
        });
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

        res.status(200).send({
            ok: true
        });
    } catch (err) {
        res.status(500).send({ ok: false, error: "Error actualizando la contraseña" });
    }

});

router.patch('/me/avatar', async (req, res) => {
    try {
        let userToken = tokenFunctions.validarToken(req.headers['authorization'].split(' ')[1]);

        const pathFoto = upload.storage(req.body.foto, userToken.nombre_completo, 'usuarios').fileName;

        await User.findByIdAndUpdate(userToken.id, {
            $set: {
                avatar: pathFoto
            }
        });

        res.status(200).send({
            ok: true
        });
    } catch (err) {
        res.status(500).send({ ok: false, error: "Error actualizando el avatar" });
    }
});




module.exports = router;