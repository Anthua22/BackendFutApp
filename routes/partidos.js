const express = require('express');
const Partido = require(__dirname + './../models/partido');
const commons = require(__dirname + './../utils/common');
const autenticado = require(__dirname + './../utils/auth');

let router = express.Router();

router.get('/', (req, res) => {
    Partido.find({ disputado: true }).sort({ fecha_modificacion: -1 }).limit(12).then(x => {
        if (x.length > 0) {
            res.send({ ok: true, resultado: resultado });
        } else {
            res.status(500).send({ ok: false, error: 'No hay ningún partido disputado' });
        }
    }).catch(err => {
        res.status(500).send({
            ok: false, error: 'No se han podido obtener los partidos'
        });
    });
});

router.get('/:id', autenticado.rutaProtegida, (req, res) => {
    Partido.findById(req.params['id']).then(x => {
        res.status(200).send({ ok: true, resultado: x })

    }).catch(err => {
        res.status(500).send({
            ok: false, error: "No se ha podido encontrar al equipo"
        });
    });
});

router.post('/', autenticado.rutaProtegida, autenticado.privilegiosAdmin, (req, res) => {
    if (req.body.equipo_local, req.body.equipo_visitante, req.body.arbitro_principal, req.body.fecha_encuentro, req.body.categoria, req.body.lugar_encuentro) {
        let newPartido = new Partido({
            equipo_local: req.body.equipo_local,
            equipo_visitante: req.body.equipo_visitante,
            arbitro_principal: req.body.arbitro_principal,
            arbitro_secundario: req.body.arbitro_secundario,
            cronometrador: req.body.cronometrador,
            fecha_encuentro: req.body.fecha_encuentro,
            categoria: req.body.categoria,
            lt: req.body.lt,
            ln: req.body.ln,
            lugar_encuentro: req.body.lugar_encuentro
        });

        newPartido.save().then(x => {
            res.send({ ok: true, resultado: x });
        }).catch(err => {
            commons.checkErrorsPartido(err, res);
        });
    } else {
        res.status(400).send({
            ok: false, error: 'Los campos equipo local, equipo visitante, árbitro principal, categoría del partido, lugar del encuentro y fecha del encuentro son obligatorios'
        });
    }
});

router.post('/categoria', (req, res) => {
    Partido.find({ categoria: req.body.categoria }).then(result => {
        if (result.length > 0) {
            res.send({ ok: true, resultado: result });
        } else {
            res.status(400).send({ ok: false, error: 'No se han encontrado partidos de la categoría especificada' })
        }
    }).catch(() => {
        res.status(500).send({
            ok: false, error: 'No se han podido obtener los partidos'
        });
    })
});

router.put('/:id', autenticado.rutaProtegida, autenticado.privilegiosAdmin, (req, res) => {
    Partido.findByIdAndUpdate(req.params['id'], {
        $set: {
            equipo_local: req.body.equipo_local,
            equipo_visitante: req.body.equipo_visitante,
            arbitro_principal: req.body.arbitro_principal,
            arbitro_secundario: req.body.arbitro_secundario,
            cronometrador: req.body.cronometrador,
            lugar_encuentro: req.body.lugar_encuentro,
            lt: req.body.lt,
            ln: req.body.ln,
            fecha_encuentro: req.body.fecha_encuentro

        }
    }, {
        new: true
    }).then(x => {
        res.status(200).send({
            ok: true, resultado: x
        });

    }).catch(() => {
        res.status(500).send({
            ok: false, error: "No se ha encontrado al equipo"
        });
    })
});

router.patch('/:id/acta', autenticado.rutaProtegida, autenticado.privilegiosActa, (req, res)=>{
    
})




module.exports = router;