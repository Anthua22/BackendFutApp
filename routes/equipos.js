const express = require('express');
const Equipo = require(__dirname + './../models/equipo');
const uploadImage = require(__dirname + './../utils/uploadImagen');
const fs = require('fs');
const commons = require(__dirname+'./../utils/common');


let router = express.Router();

router.get('/', (req, res) => {
    Equipo.find().limit(11).then(resultado => {
        res.status(200).send({
            ok: true, resultado: resultado
        });
    }).catch(err => {
        res.status(500).send({
            ok: false, error: 'No se han podido obtener los equipos'
        });
    });
});

router.get('/:id', (req, res) => {
    Equipo.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado })
        } else {
            res.status(400).send({
                ok: false, error: "Producto no encontrado"
            });
        }
    }).catch(err => {
        res.status(400).send({
            ok: false, error: "Producto no encontrado"
        });
    })
});

router.post('/', (req, res) => {
    if (req.body.nombre && req.body.email && req.body.direccion_campo) {
        let newEquipo = new Equipo({
            nombre: req.body.nombre,
            email: req.body.email,
            direccion_campo: req.body.direccion_campo,
            categoria: req.body.categoria
        });
        let pathFoto = '';
        if (req.body.escudo) {
            pathFoto = uploadImage(req.body.escudo, req.body.nombre, 'equipos').fileName;
            newEquipo.escudo = pathFoto;
        }
        newEquipo.save().then(resultado => {
            res.status(201).send({
                ok: true, resultado: resultado
            });
        }).catch(err => {
            if (req.body.escudo && pathFoto !== '') {
                fs.unlinkSync(__dirname + "./../uploads/images/" + pathFoto);
            }
            if (err.code === 11000) {
                res.status(400).send({
                    ok: false, error: 'El email del equipo introducido ya existe'
                });
            } else if (err.errors.email) {
                res.status(400).send({
                    ok: false, error: 'Formato de email incorrecto. Sintanxis: example@example.com'
                });
            } else {
                res.status(400).send({
                    ok: false, error: 'Error introduciendo el equipo'
                });
            }
        });

    } else {
        res.status(400).send({
            ok: false, error: 'Los campos nombre del equipo, email y dirección de campo son obligatorios'
        });
    }

});

router.post('/categoria', (req, res) => {
    Equipo.find({ categoria: req.body.categoria }).then(resultado => {
        if (x.length > 0) {
            res.send({ ok: true, resultado: resultado });
        } else {
            res.status(500).send({ ok: false, error: 'No se han encontrados equipos en la categoría especificada' })
        }

    }).catch(err => {
        res.status(500).send({
            ok: false, error: 'No se han podido obtener equipos'
        });
    });
});

router.post('/:idEquipo/miembro_equipo', (req, res) => {

    let newMiembro = req.body.miembro;
    const pathFoto = uploadImage(req.body.miembro.foto, req.body.miembro.nombre_completo, 'miembros_equipos').fileName;
    newMiembro.foto = pathFoto;

    Equipo.findByIdAndUpdate(req.params['idEquipo'], {
        $push: {
            miembros: newMiembro
        }
    }, {
        new: true
    }).then(x => {
        if (x) {
            res.status(201).send({
                ok: true, resultado: x
            });
        } else {
            res.status(400).send({
                ok: false, error: "No existe el equipo"
            });
        }
    }).catch(err => {
        console.log(err)
        commons('miembros_equipos/'+pathFoto);
        res.status(400).send({
            ok: false, error: "Error insertando un nuevo miembro al equipo"
        })
    });
});



module.exports = router;