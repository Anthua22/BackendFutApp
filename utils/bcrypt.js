const saltRounds = 10;
const bcrypt = require('bcrypt');


function encriptar(textoPlano) {

    return bcrypt.hash(textoPlano, saltRounds);
}


function desincriptar(texto, hash) {
    return bcrypt.compare(texto, hash);
}

module.exports = {
    encriptar: encriptar,
    desincriptar: desincriptar
}