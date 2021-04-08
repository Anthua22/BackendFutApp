const jwt = require('jsonwebtoken');

const key = "mpFNbfhWspG^koTw";

let generarToken = user => {
    return jwt.sign({ user: user }, key);
};

let validarToken = (token) => {
    try {
        let resultado = jwt.verify(token, key);
        return resultado;
    } catch (e) { }
};

module.exports = {
    generarToken: generarToken,
    validarToken: validarToken
}