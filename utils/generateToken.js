const jwt = require('jsonwebtoken');

const key = "mpFNbfhWspG^koTw";

let generarToken = user => {
    return jwt.sign({ user: user }, key);
};

module.exports = generarToken;
