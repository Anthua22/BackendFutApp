const fs = require('fs');


let deleteImagen = (pathFoto) => {
    const path=__dirname+'./../uploads/images/'+pathFoto;
    fs.unlinkSync(path);
};


module.exports = deleteImagen;