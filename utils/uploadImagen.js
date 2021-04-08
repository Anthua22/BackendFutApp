const base64ToImage = require('base64-to-image');
let path = __dirname+'./../uploads/images/';

let storage = (base64, nombre, carpeta) => {
    path += carpeta+'/'; 
    console.log(path)
    let optionalObj = { 'fileName': Date.now() + "_" +nombre };
    return base64ToImage(base64, path, optionalObj);
}

module.exports = storage;
