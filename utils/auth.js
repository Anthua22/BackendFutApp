const tokenFunctions = require(__dirname + '/token');

let protegerRuta = (req, res, next) => {
    if (req.headers['authorization']) {
        let token = req.headers['authorization'].split(' ')[1];
        if (tokenFunctions.validarToken(token)) {
            next();
        }
        else
            res.status(401).send({ ok: false, error: "Unauthorized" });
    } else
        res.status(401).send({ ok: false, error: "Unauthorized" });

};

let privilegiosAdmin = (req, res, next) => {
    if (req.headers['authorization']) {
        let token = req.headers['authorization'].split(' ')[1];
        let user = tokenFunctions.validarToken(token);
        if (user) {
            if (user.rol === 'ADMIN') {
                next();
            } else {
                res.status(401).send({ ok: false, error: "Unauthorized" });
            }
        }
        else
            res.status(401).send({ ok: false, error: "Unauthorized" });
    } else
        res.status(401).send({ ok: false, error: "Unauthorized" });
}

module.exports = { protegerRuta, privilegiosAdmin };