const tokenFunctions = require(__dirname + '/token');

let rutaProtegida = (req, res, next) => {
    if (req.headers['authorization']) {
        let token = req.headers['authorization'].split(' ')[1];
        if (tokenFunctions.validarToken(token)) {
            next();
        }
        else
            res.status(401).send({ error: "Unauthorized" });
    } else
        res.status(401).send({ error: "Unauthorized" });

};

let privilegiosAdmin = (req, res, next) => {
    let token = req.headers['authorization'].split(' ')[1];
    let user = tokenFunctions.validarToken(token);
    if (user) {
        if (user.rol === 'ADMIN') {
            next();
        } else {
            res.status(401).send({ error: "Unauthorized" });
        }
    }
    else
        res.status(401).send({ error: "Unauthorized" });

}

let privilegiosActa = (req, res, next) => {
    let token = req.headers['authorization'].split(' ')[1];
    let user = tokenFunctions.validarToken(token);
    if (user) {
        if (user.rol === 'ADMIN' || user._id === req.body.arbitro_principal ||
            user._id === req.body.arbitro_secundario ||
            user._id === req.body.cronometrador) {
            next();
        } else {
            res.status(401).send({ error: "Unauthorized" });
        }
    }

}

let peticionesLocalHost = (req, res, next) => {
    const allowedOrigins = [
        'capacitor://localhost',
        'ionic://localhost',
        'http://localhost',
        'http://localhost:8080',
        'http://localhost:8100'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}
module.exports = { rutaProtegida, privilegiosAdmin, privilegiosActa, peticionesLocalHost };