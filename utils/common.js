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
            error: 'El email introducido ya existe'
        });
    } else if (err.errors.email) {
        res.status(400).send({
            error: 'Formato de email incorrecto. Sintanxis: example@example.com'
        });
    } else if (err.errors.password) {
        res.status(400).send({
            error: 'La contraseña debe contener al menos 8 digitos con al menos un carácter en mayúscula, uno en minúscula, un número y algún carácter especial'
        });
    } else {
        res.status(500).send({
             error: 'Error introduciendo los datos'
        });
    }
}

let checkErrorsPartido = (err, res) => {
    const fechaActual = moment().format('YYYY-MM-DD');
    if (err.errors.fecha_encuentro) {
        res.status(400).send({
          error: 'Formato de fecha incorrecta (YYYY-MM-DD) o tiene que ser superior a la fecha ' + fechaActual
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

let obtenerItem = (array, id) => {
    let item = null;
    array.forEach(x => {
        if (x._id + '' === id + '') {
            item = x;
            return;
        }
    });

    return item;
}

let borrarFotosMiembrosClub = equipo => {
    return new Promise((resolve, reject) => {
        try {
            equipo.miembros.forEach(x => {
                if (x.foto && x.foto !== '') {
                    deleteImagen('miembros_equipos/' + x.foto);
                }
            });
            resolve();
        } catch (err) {
            reject(err);
        }   
    })
    
}

const GOOGLE_CLIENT_ID = "763516909829-5p7538slp0m1j5a2jr22c88cuisi6gdl.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "C3B5uld4P1zFa5CuVEfhqRqq";

module.exports = {
    deleteImagen,
    checkErrors,
    checkErrorsPartido,
    obtenerItem,
    borrarFotosMiembrosClub,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
}