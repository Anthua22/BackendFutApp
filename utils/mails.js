const nodemailer = require('nodemailer');
const moment = require('moment');

// email sender function
exports.sendEmail = function (req, res) {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: 'notificacionesfutapp@gmail.com',
            pass: 'futapp123'
        }
    });
    // Definimos el email
    const fechaCompleta = req.body.fecha;
    const fecha = moment(fechaCompleta).format('ll');
    const hora = moment().format('hh:mm A');
    const equipoLocal = req.body.equipo_local;
    const equipoVisitante = req.body.equipo_visitante;
    const arbitros = req.body.arbitros;

    let emailArbitros = [];
    let nombresArbitros = [];
    arbitros.forEach(element => {
        emailArbitros.push(element.email);
        nombresArbitros.push(element.nombre);
    });
    const emails = `${equipoLocal.email}, ${equipoVisitante.email}, ${emailArbitros.join(',')}`

    const mailOptions = {
        from: 'notificacionesfutapp@gmail.com',
        to: emails,
        subject: 'Notificación Partido',
        text: `Se ha asignado el siguiente partido:\n${equipoLocal.nombre} vs ${equipoVisitante.nombre}\nEn el día: ${fecha}\nA las: ${hora}\nLos árbitros son: ${nombresArbitros}`
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send(500, error.message);
        } else {
            res.status(200).send();
        }
    });
};