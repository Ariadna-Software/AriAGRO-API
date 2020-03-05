var express = require('express');
var router = express.Router();
var enlacesDb = require("./enlaces_db_mysql");

// GetEnlaces
// Devuelve una lista de objetos con todos los recursos de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos recursos
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        enlacesDb.getEnlacesBuscar(nombre, function(err, recursos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(recursos);
            }
        });

    } else {
        enlacesDb.getEnlaces(function(err, recursos) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(recursos);
            }
        });
    }
});

// GetEnlace
// devuelve el enlace con el id pasado
router.get('/:enlaceId', function(req, res) {
    enlacesDb.getEnlace(req.params.enlaceId, function(err, enlace) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (enlace == null) {
                res.status(404).send("Enlace no encontrado");
            } else {
                res.json(enlace);
            }
        }
    });
});


// PostEnlace
// permite dar de alta un enlace
router.post('/', function(req, res) {
    enlacesDb.postEnlace(req.body.enlace, function(err, enlace) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(enlace);
        }
    });
});



// PutEnlace
// modifica el enlace con el id pasado
router.put('/:enlaceId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    enlacesDb.getEnlace(req.params.enlaceId, function(err, enlace) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (enlace == null) {
                res.status(404).send("Enlace no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                enlacesDb.putEnlace(req.params.enlaceId, req.body.enlace, function(err, enlace) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(enlace);
                    }
                });
            }
        }
    });
});

// DeleteEnlace
// elimina un enlace de la base de datos
router.delete('/:enlaceId', function(req, res) {
    var enlace = req.body.enlace;
    enlacesDb.deleteEnlace(req.params.enlaceId, enlace, function(err, enlace) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(enlace);;
        }
    });
});

// Exports
module.exports = router;