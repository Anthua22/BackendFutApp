const base64ToImage = require('base64-to-image');

let storage = (base64, carpeta) => {
    try {
        const path = __dirname + './../uploads/images/' + carpeta + '/';
        let optionalObj = { 'fileName': Date.now() + "_" };
        return base64ToImage(base64, path, optionalObj);

    } catch (err) {
        console.log(err)
    }

}





module.exports = { storage };
