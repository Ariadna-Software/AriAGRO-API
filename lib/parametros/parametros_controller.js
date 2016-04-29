var express = require('express');
var router = express.Router();
var parametrosDb = require("./parametros_db_mysql");

// GetParametros
// Devuelve una lista de objetos con todos los parametros de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos parametros
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        parametrosDb.getParametrosBuscar(nombre, function(err, parametros) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(parametros);
            }
        });

    } else {
        parametrosDb.getParametros(function(err, parametros) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(parametros);
            }
        });
    }
});

// GetParametro
// devuelve el parametro con el id pasado
router.get('/:parametroId', function(req, res) {
    parametrosDb.getParametro(req.params.parametroId, function(err, parametro) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (parametro == null) {
                res.status(404).send("Parametro no encontrado");
            } else {
                res.json(parametro);
            }
        }
    });
});

// PostParametro
// permite dar de alta un parametro
router.post('/', function(req, res) {
    parametrosDb.postParametro(req.body.parametro, function(err, parametro) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(parametro);
        }
    });
});



// PutParametro
// modifica el parametro con el id pasado
router.put('/:parametroId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    parametrosDb.getParametro(req.params.parametroId, function(err, parametro) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (parametro == null) {
                res.status(404).send("Parametro no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                parametrosDb.putParametro(req.params.parametroId, req.body.parametro, function(err, parametro) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(parametro);
                    }
                });
            }
        }
    });
});

// DeleteParametro
// elimina un parametro de la base de datos
router.delete('/:parametroId', function(req, res) {
    var parametro = req.body.parametro;
    parametrosDb.deleteParametro(req.params.parametroId, parametro, function(err, parametro) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;