var express = require('express');
var router = express.Router();
var camposMysql = require('./campos_mysql');

router.get('/socio', function(req, res) {
    // confirmar que se han recibido correctamente los parámetros
    // codsocio y campanya
    // password: password asignada
    query = req.query;
    if (query.codsocio && query.campanya) {
        camposMysql.getCamposSocio(query.codsocio, query.campanya, function(err, campos) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (campos) {
                return res.json(campos)
            } else {
                return res.status(404).send('Campo no encontrado');
            }
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

// Exports
module.exports = router;
