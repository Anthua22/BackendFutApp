const tokenFunctions = require(__dirname + '/token');

let protegerRuta = (req, res, next) => {
    let token = req.headers['authorization'].split(' ')[1];
    if (token) {
        if (tokenFunctions.validarToken(token)) {
            next();
        }
        else
            res.status(401).send({ ok: false, error: "Unauthorized" });
    } else
        res.status(401).send({ ok: false, error: "Unauthorized" });

};

module.exports = protegerRuta;