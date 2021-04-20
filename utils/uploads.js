const base64ToImage = require('base64-to-image');


let storage = (base64, nombre, carpeta) => {
    const path = __dirname + './../uploads/images/' + carpeta + '/';
    let optionalObj = { 'fileName': Date.now() + "_" + nombre };
    return base64ToImage(base64, path, optionalObj);
}


let storagePdf = (base64, nombre) => {
    let obj = document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = '842pt';
    obj.type = 'application/pdf';
    obj.data = 'data:application/pdf;base64,' + base64;
    document.body.appendChild(obj);
}

module.exports = {storage, storagePdf};
