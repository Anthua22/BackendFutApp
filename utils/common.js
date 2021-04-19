const fs = require('fs');


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
        res.status(400).send({
            ok: false, error: 'Error introduciendo los datos'
        });
    }
}
module.exports = {
    deleteImagen,
    checkErrors
}