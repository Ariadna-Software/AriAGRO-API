var express = require('express');
var router = express.Router();
var recursosDb = require("./recursos_db_mysql");

// GetRecursos
// Devuelve una lista de objetos con todos los recursos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos recursos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        recursosDb.getRecursosBuscar(nombre, function(err, recursos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(recursos);
            }
        });

    } else {
        recursosDb.getRecursos(function(err, recursos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(recursos);
            }
        });
    }
});

// GetRecurso
// devuelve el recurso con el id pasado
router.get('/:recursoId', function(req, res) {
    recursosDb.getRecurso(req.params.recursoId, function(err, recurso) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (recurso == null) {
                res.status(404).send("Recurso no encontrado");
            } else {
                res.json(recurso);
            }
        }
    });
});


// PostRecurso
// permite dar de alta un recurso
router.post('/', function(req, res) {
    recursosDb.postRecurso(req.body.recurso, function(err, recurso) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(recurso);
        }
    });
});



// PutRecurso
// modifica el recurso con el id pasado
router.put('/:recursoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    recursosDb.getRecurso(req.params.recursoId, function(err, recurso) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (recurso == null) {
                res.status(404).send("Recurso no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                recursosDb.putRecurso(req.params.recursoId, req.body.recurso, function(err, recurso) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(recurso);
                    }
                });
            }
        }
    });
});

// DeleteRecurso
// elimina un recurso de la base de datos
router.delete('/:recursoId', function(req, res) {
    var recurso = req.body.recurso;
    recursosDb.deleteRecurso(req.params.recursoId, recurso, function(err, recurso) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;