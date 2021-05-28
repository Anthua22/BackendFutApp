const mongoose = require('mongoose');
const MiembroEquipo = require('./miembroequipo');
const MiembrosEquipo = require('./miembroequipo');
const Sanciones = require('./sancion_partido');

let InfoPartidoSchema = new mongoose.Schema({
    partido:{ type: mongoose.Schema.Types.ObjectId, ref: 'partidos' },
    titularesLocales:[MiembrosEquipo],
    titularesVisitantes:[MiembrosEquipo],
    suplentesLocales:[MiembrosEquipo],
    suplentesVisitantes:[MiembrosEquipo],
    sanciones:[Sanciones],
    capitanLocal:MiembroEquipo,
    capitanVisitan
});


