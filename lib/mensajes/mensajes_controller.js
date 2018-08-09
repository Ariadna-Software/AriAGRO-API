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

// GetMensajesUsuaio
// devuelve el mensaje con el id pasado
router.get('/usuario/:usuarioPushId', function(req, res) {
    mensajesDb.getMensajesUsuario(req.params.usuarioPushId, function(err, mensajes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(mensajes);
        }
    });
});

// GetUsuariosMensaje
// devuelve los usuarios relacionados con el mensaje
router.get('/usuarios-mensaje/:mensajeId', function(req, res) {
    mensajesDb.getUsuariosMensaje(req.params.mensajeId, function(err, mensajes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(mensajes);
        }
    });
});


// PutMensaje
// Actualiza el mensaje como leido en la fecha pasada
router.put('/usuario/:usuarioPushId', function(req, res) {
    mensajesDb.putMensajesUsuario(req.params.usuarioPushId, req.body.mensajeId, req.body.fecha, function(err, mensajes) {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            res.json(mensajes);
        }
    });
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
router.post('/send', function(req, res) {
    mensajesDb.postSendMensaje(req.body.mensaje, function(err, mensaje) {
        if (err) {
            console.log("SEND (ERR): ", err);
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// PostCorreo
// Envia un mensaje por correo electrónico
router.post('/correo', function(req, res) {
    mensajesDb.postCorreo(req.body.correo, function(err, mensaje) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// PostMensaje
// permite dar de alta un mensaje
router.post('/sendnew', function(req, res) {
    mensajesDb.postSendMensajeNew(req.body.mensaje, function(err, mensaje) {
        if (err) {
            console.log("SENDNEW (ERR): ", err);
            res.status(500).send(err.message);
        } else {
            res.json(mensaje);
        }
    });
});

// PostMensaje
// permite dar de alta un mensaje
router.post('/', function(req, res) {
    mensajesDb.postMensaje(req.body.mensaje, function(err, mensaje) {
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

//Envio de pdf por correo
// PostEnviarCorreos
router.post('/preparar-correo/clasif', function (req, res) {
   var numalbar = req.body.numalbar;
   var campanya = req.body.campanya;
   mensajesDb.postPrepararCorreos(numalbar, campanya, function (err, result) {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});


router.post('/enviar/correo/clasif', function (req, res) {
    var numalbar = req.body.numalbar;
    var email = req.body.email;
    var ruta = req.body.ruta;
    var coop = req.body.coop;
    mensajesDb.postEnviarCorreos(numalbar, email, ruta, coop, function (err, result) {
         if (err) return res.status(500).send(err.message);
         res.json(result);
     });
 });

// Exports
module.exports = router;
