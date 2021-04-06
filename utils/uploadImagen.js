const base64ToImage = require('base64-to-image');
const path = __dirname+'./../uploads/';

let storage = (req) => {
    let optionalObj = { 'fileName': Date.now() + "_" +req.body.nombre_completo };
    return base64ToImage(req.body.foto, path, optionalObj);
}

module.exports = storage;
