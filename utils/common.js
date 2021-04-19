const fs = require('fs');
const moment = require('moment');

let deleteImagen = (pathFoto) => {
    const path = __dirname + './../uploads/images/' + pathFoto;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

};

let checkErrors = (err, res) => {
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
        res.status(500).send({
            ok: false, error: 'Error introduciendo los datos'
        });
    }
}

let checkErrorsPartido = (err, res) => {
    const fechaActual = moment().format('YYYY-MM-DD');
    if (err.errors.fecha_encuentro) {
        res.status(400).send({
            ok: false, error: 'Formato de fecha incorrecta (YYYY-MM-DD) o tiene que ser superior a la fecha '+fechaActual
        });
    } else if (err.errors.arbitro_principal || err.errors.arbitro_secundario || err.errors.cronometrador) {
        res.status(400).send({
            ok: false, error: 'El árbitro principal/secundario/cronometrador no existe'
        });
    } else if (err.errors.equipo_local) {
        res.status(400).send({
            ok: false, error: 'El equipo local no existe'
        });
    } else if (err.errors.equipo_visitante) {
        res.status(400).send({
            ok: false, error: 'El equipo visitante no existe'
        });
    } else {
        res.status(500).send({
            ok: false, error: 'No se ha podido insertar el partido'
        });
    }
}

let obtenerItem = (array, id) =>{
    let item = null;
    array.forEach(x => {
        if(x._id+''===id+''){
            item = x;
            return;
        }
    });

    return item;
}

module.exports = {
    deleteImagen,
    checkErrors,
    checkErrorsPartido,
    obtenerItem
}