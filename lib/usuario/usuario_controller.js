var express = require('express');
var router = express.Router();
var usuarioMysql = require('./usuario_mysql');

router.get('/login', function(req, res) {
    // confirmar que se han recibido correctamente los parámetros
    // login: identificador del usuario para el login
    // password: password asignada
    query = req.query;
    if (query.login && query.password) {
        usuarioMysql.getLogin(query.login, query.password, function(err, usuario) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (usuario) {
                return res.json(usuario)
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});


// Exports
module.exports = router;
