
const fs = require('fs');

let storage = (base64, carpeta) => {
    const Image = base64.split(',');
    const extencionBlock = Image[0].split('/');
    const extencionSubBlock = extencionBlock[1].split(';');
    const name = Date.now() + '.' + extencionSubBlock[0];
    const path = __dirname + '/../uploads/images/' + carpeta + '/' + name;
    fs.writeFile(path, Image[1], 'base64', function (err) {
        if (err) {
            throw 'No se ha podido crear el archivo';
        }
    });
    return name;
}

let storageActa = (base64) => {
    const File = base64.split(',');
    const extencionBlock = File[0].split('/');
    const extencionSubBlock = extencionBlock[1].split(';');
    const name = Date.now() + '.' + extencionSubBlock[0];
    const path = __dirname + '/../uploads/actas/' + name;
    fs.writeFile(path, File[1], 'base64', function (err) {
        if (err) {
            throw 'No se ha podido crear el archivo';
        }
    });
    return name;
}





module.exports = { storage, storageActa };
