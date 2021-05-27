const express = require('express');
const Partido = require(__dirname + './../models/partido');
const commons = require(__dirname + './../utils/common');
const autenticado = require(__dirname + './../utils/auth');
const uploads = require(__dirname + './../utils/uploads');

const moment = require('moment');

let router = express.Router();

router.get('/', (req, res) => {
  Partido.find().populate('equipo_local')
    .populate('equipo_visitante')
    .populate('arbitro_principal')
    .populate('arbitro_secundario')
    .populate('cronometrador')
    .sort({ fecha_modificacion: -1 })
    .then(x => {
      res.send({ resultado: x });
    }).catch(err => {
      res.status(500).send({
        error: 'No se han podido obtener los partidos'
      });
    });
});

router.get('/:id', autenticado.rutaProtegida, (req, res) => {
  Partido.findById(req.params['id']).populate('equipo_local').populate('arbitro_principal').populate('equipo_visitante').then(x => {
    res.status(200).send({ resultado: x })

  }).catch(err => {
    res.status(500).send({
      error: "No se ha podido encontrar al equipo"
    });
  });
});

router.post('/', autenticado.rutaProtegida, autenticado.privilegiosAdmin, (req, res) => {
  if (req.body.equipo_local && req.body.equipo_visitante && req.body.arbitro_principal && req.body.fecha_encuentro && req.body.categoria && req.body.lugar_encuentro) {
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
      res.send({ resultado: x });
    }).catch(err => {
      commons.checkErrorsPartido(err, res);
    });
  } else {
    res.status(400).send({
      error: 'Los campos equipo local, equipo visitante, árbitro principal, categoría del partido, lugar del encuentro y fecha del encuentro son obligatorios'
    });
  }
});

router.post('/categoria', (req, res) => {
  Partido.find({ categoria: req.body.categoria })
    .populate('equipo_visitante')
    .populate('equipo_local')
    .populate('arbitro_principal')
    .populate('arbitro_secundario')
    .populate('cronometrador')
    .sort({ fecha_modificacion: -1 }).then(result => {

      res.send({ resultado: result });

    }).catch(() => {
      res.status(500).send({
        error: 'No se han podido obtener los partidos'
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
      fecha_encuentro: req.body.fecha_encuentro,
      resultado: req.body.resultado

    }
  }, {
    new: true
  }).populate('equipo_local').populate('equipo_visitante').then(x => {
    res.status(200).send({
      resultado: x
    });

  }).catch(() => {
    res.status(500).send({
      error: "No se ha encontrado al equipo"
    });
  });
});

router.patch('/:id/acta', autenticado.rutaProtegida, autenticado.privilegiosActa, (req, res) => {
  const acta = `http://${req.hostname}:8080/actas/${uploads.storage(req.body.acta, 'actas')}`;
  Partido.findByIdAndUpdate(req.params['id'], {
    $set: {
      acta: acta,
      fecha_modificacion: moment().format('YYYY-MM-DD')
    }
  }, {
    new: true
  }).populate('equipo_local').populate('equipo_visitante').then(x => {
    res.status(200).send({
      resultado: x
    });

  }).catch(() => {
    res.status(500).send({
      error: "No se ha podido subir el acta del partido"
    });
  })
});

router.delete('/:id', async (req, res) => {
  try {
    let partidoBorrar = await Partido.findByIdAndRemove(req.params['id']).populate('equipo_local').populate('equipo_visitante');
    if (partidoBorrar) {
      res.status(200)
        .send({ resultado: partidoBorrar });
    } else {
      res.status(400).send({
        error: "No se ha encontrado el partido"
      });
    }
  } catch (err) {
    res.status(500).send({
      error: "No se ha encontrado el partido"
    });
  }

});


module.exports = router;