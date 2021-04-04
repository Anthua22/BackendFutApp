const fs = require('fs');
const Jimp = require('jimp');
const base64ToImage = require('base64-to-image');
const path = './../uploads/';

let storage = (req, res) => {
    let optionalObj = { 'fileName': Date.now() + "_" +req.body.nombre_completo };
    base64ToImage(data, path, optionalObj);
}

module.exports = storage;
