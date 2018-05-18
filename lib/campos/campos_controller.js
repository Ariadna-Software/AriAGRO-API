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

router.get('/buscar/clasificacion/:codcampo/:campanya', function(req, res) {
    
    var codcampo =  req.params.codcampo;
    var campanya = req.params.campanya;
        camposMysql.getCampoClasificacion(codcampo, campanya,function(err, clasificacion) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (clasificacion) {
                return res.json(clasificacion)
            } else {
                return res.status(404).send('clasificacion no encontrada');
            }
        });
    
});

router.get('/buscar/clasificacion/albaran/:numalbar/:campanya', function(req, res) {
    
    var numalbar =  req.params.numalbar;
    var campanya = req.params.campanya;
        camposMysql.getAlbaranClasificacion(numalbar, campanya,function(err, clasificacion) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (clasificacion) {
                return res.json(clasificacion)
            } else {
                return res.status(404).send('clasificacion no encontrada');
            }
        });
    
});

// Exports
module.exports = router;
