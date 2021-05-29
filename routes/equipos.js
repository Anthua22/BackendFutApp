const express = require('express');
const Equipo = require(__dirname + './../models/equipo');
const MiembroEquipo = require(__dirname + './../models/miembroequipo');
const upload = require(__dirname + './../utils/uploads');
const commons = require(__dirname + './../utils/common');
const autenticado = require(__dirname + './../utils/auth');

let router = express.Router();

router.get('/', (req, res) => {
    Equipo.find().then(resultado => {
        res.status(200).send({
            resultado: resultado
        });
    }).catch(err => {
        res.status(500).send({
            error: 'No se han podido obtener los equipos'
        });
    });
});

router.get('/:id', (req, res) => {
    Equipo.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.status(200).send({ resultado: resultado })
        } else {
            res.status(400).send({
                error: "Equipo no encontrado"
            });
        }
    }).catch(err => {
        res.status(500).send({
            error: "No se ha podido encontrar al equipo"
        });
    })
});

router.get('/:id/miembros_equipo/jugadores', async (req, res) => {
    try {
        const equipoResultado = await Equipo.findById( req.params['id'] ).select('miembros');
        const resultado = equipoResultado.miembros.filter(x => x.rol === 'JUGADOR');
        res.send({ resultado: resultado });
    } catch (err) {
        response.status(500).send({
            error: 'No se han podido obtener los miembros del equipo'
        })
    }


});

router.post('/', (req, res) => {
    if (req.body.nombre && req.body.email && req.body.direccion_campo) {
        let newEquipo = new Equipo({
            nombre: req.body.nombre,
            email: req.body.email,
            direccion_campo: req.body.direccion_campo,
            categoria: req.body.categoria
        });
        let pathFoto = `http://${req.hostname}:8080/equipos/`;
        if (req.body.escudo) {
            pathFoto += upload.storage(req.body.escudo, 'equipos');
            newEquipo.escudo = pathFoto;
        }
        newEquipo.save().then(resultado => {
            res.status(201).send({
                resultado: resultado
            });
        }).catch(err => {
            if (req.body.escudo && pathFoto !== '') {
                commons.deleteImagen('equipos/' + pathFoto);
            }
            commons.checkErrors(err, res);
        });

    } else {
        res.status(400).send({
            error: 'Los campos nombre del equipo, email y dirección de campo son obligatorios'
        });
    }

});

router.post('/categoria', (req, res) => {
    Equipo.find({ categoria: req.body.categoria }).then(resultado => {
        if (resultado.length > 0) {
            res.send({ resultado: resultado });
        } else {
            res.status(500).send({ error: 'No se han encontrado equipos en la categoría especificada' })
        }

    }).catch(err => {
        res.status(500).send({
            error: 'No se han podido obtener los equipos'
        });
    });
});

router.post('/:idEquipo/miembros_equipo', (req, res) => {

    let newMiembro = req.body.miembro;
    const pathFoto = `http://${req.hostname}:8080/miembros_equipos/`;
    newMiembro.foto = pathFoto + upload.storage(req.body.miembro.foto, 'miembros_equipos');

    Equipo.findByIdAndUpdate(req.params['idEquipo'], {
        $push: {
            miembros: newMiembro
        }
    }, {
        new: true
    }).then(x => {

        if (x) {
            res.status(201).send({
                resultado: x
            });
        } else {
            res.status(400).send({
                error: "No existe el equipo"
            });
        }
    }).catch(err => {
        commons.deleteImagen('miembros_equipos/' + pathFoto);
        res.status(500).send({
            error: "Error insertando un nuevo miembro al equipo"
        })
    });
});

router.put('/:id', async (req, res) => {
    let fotoNueva = `http://${req.hostname}:8080/equipos/`;
    try {
        if (req.body.nombre && req.body.categoria) {
            if (req.body.escudo) {
                fotoNueva += upload.storage(req.body.escudo, 'equipos');

                const EquipoActualizado = await Equipo.findByIdAndUpdate(req.params['id'], {
                    $set: {
                        nombre: req.body.nombre,
                        categoria: req.body.categoria,
                        direccion_campo: req.body.direccion_campo,
                        escudo: fotoNueva
                    }
                }, {
                    new: true
                });
                if (EquipoActualizado) {
                    res.status(200).send({
                        resultado: EquipoActualizado
                    });
                } else {
                    res.status(500).send({
                        resultado: "Error modificando el equipo"
                    });
                }

            } else {
                const EquipoActualizado = await Equipo.findByIdAndUpdate(req.params['id'], {
                    $set: {
                        nombre: req.body.nombre_completo,
                        categoria: req.body.categoria,
                        direccion_campo: req.body.direccion_campo,
                    }
                }, {
                    new: true
                });
                if (EquipoActualizado) {
                    res.status(200).send({
                        resultado: EquipoActualizado
                    });
                } else {
                    res.status(500).send({
                        error: "Error modificando el equipo"
                    });
                }
            }

        } else {
            res.status(400).send({
                error: "Faltan campos por dar valor (nombre, email, categoria, direccion del campo)"
            });
        }
    } catch (err) {
        res.status(500).send({
            error: "Error actualizando el equipo"
        });
    }


});

router.delete('/:id', autenticado.privilegiosAdmin, async (req, res) => {
    try {
        let EquipoBorrar = await Equipo.findById(req.params['id']);
        if (EquipoBorrar.escudo && EquipoBorrar.escudo !== '') {
            commons.deleteImagen('equipos/' + EquipoBorrar.escudo);
        }
        await commons.borrarFotosMiembrosClub(EquipoBorrar);
        EquipoBorrar = await Equipo.findByIdAndRemove(req.params['id']);
        if (EquipoBorrar) {
            res.status(200)
                .send({ resultado: EquipoBorrar });
        }
    } catch (err) {
        res.status(500).send({
            error: "No se ha encontrado el equipo"
        });
    }

});

router.delete('/:idEquipo/miembros_equipo/:idMiembro', autenticado.privilegiosAdmin, async (req, res) => {
    try {
        let EquipoMiembro = await Equipo.findById(req.params['idEquipo']);
        let miembro = commons.obtenerItem(EquipoMiembro.miembros, req.params['idMiembro']);
        if (miembro && miembro.foto && miembro.foto !== '') {
            commons.deleteImagen('miembros_equipos/' + miembro.foto);
        }
        EquipoMiembro = await Equipo.findByIdAndUpdate(req.params['idEquipo'], {
            $pull: {
                miembros: { _id: req.params['idMiembro'] }
            }
        }, {
            new: true
        });
        if (EquipoMiembro) {//Comprobamos si existía el comentario sino existía devolvería null
            res.send({
                resultado: EquipoMiembro
            })
        } else {
            res.status(400).send({
                error: "No existe el miembro del equipo"
            })
        }


    } catch (err) {
        res.status(500).send({
            error: 'Error borrando el miembro del equipo'
        });
    }
});


module.exports = router;