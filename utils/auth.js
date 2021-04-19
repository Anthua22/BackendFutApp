const tokenFunctions = require(__dirname + '/token');

let rutaProtegida = (req, res, next) => {
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

}

let privilegiosActa = (req, res, next) => {
    let user = tokenFunctions.validarToken(token);
    if (user) {
        if (user.rol === 'ADMIN' || user._id === req.body.arbitro_principal ||
            user._id === req.body.arbitro_secundario ||
            user._id === req.body.cronometrador) {
            next();
        } else {
            res.status(401).send({ ok: false, error: "Unauthorized" });
        }
    }

}
module.exports = { rutaProtegida, privilegiosAdmin, privilegiosActa };