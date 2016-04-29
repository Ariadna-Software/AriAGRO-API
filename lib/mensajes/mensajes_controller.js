var express = require('express');
var router = express.Router();
var mensajesDb = require("./mensajes_db_mysql");

// GetMensajes
// Devuelve una lista de objetos con todos los mensajes de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos mensajes
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        mensajesDb.getMensajesBuscar(nombre, function(err, mensajes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mensajes);
            }
        });

    } else {
        mensajesDb.getMensajes(function(err, mensajes) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(mensajes);
            }
        });
    }
});

// GetMensaje
// devuelve el mensaje con el id pasado
router.get('/:mensajeId', function(req, res) {
    mensajesDb.getMensaje(req.params.mensajeId, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (mensaje == null) {
                res.status(404).send("Mensaje no encontrado");
            } else {
                res.json(mensaje);
            }
        }
    });
});

// PostMensaje
// permite dar de alta un mensaje
router.post('/', function(req, res) {
    mensajesDb.postSendMensaje(req.body.mensaje, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});



// PutMensaje
// modifica el mensaje con el id pasado
router.put('/:mensajeId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    mensajesDb.getMensaje(req.params.mensajeId, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (mensaje == null) {
                res.status(404).send("Mensaje no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                mensajesDb.putMensaje(req.params.mensajeId, req.body.mensaje, function(err, mensaje) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(mensaje);
                    }
                });
            }
        }
    });
});

// DeleteMensaje
// elimina un mensaje de la base de datos
router.delete('/:mensajeId', function(req, res) {
    var mensaje = req.body.mensaje;
    mensajesDb.deleteMensaje(req.params.mensajeId, mensaje, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;
