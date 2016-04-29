var express = require('express');
var router = express.Router();
var usuariosPushDb = require("./usupush_db_mysql");

// GetUsuariosPush
// Devuelve una lista de objetos con todos los usuariosPush de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos usuariosPush
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        usuariosPushDb.getUsuariosPushBuscar(nombre, function(err, usuariosPush) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuariosPush);
            }
        });

    } else {
        usuariosPushDb.getUsuariosPush(function(err, usuariosPush) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuariosPush);
            }
        });
    }
});

// GetUsuariosPushLogados
// Devuelve una lista de objetos con todos los usuariosPush de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos usuariosPush
// que lo contengan.
router.get('/logados', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        usuariosPushDb.getUsuariosPushBuscarLogados(nombre, function(err, usuariosPush) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuariosPush);
            }
        });

    } else {
        usuariosPushDb.getUsuariosPushLogados(function(err, usuariosPush) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(usuariosPush);
            }
        });
    }
});


// GetUsuarioPush
// devuelve el usuarioPush con el id pasado
router.get('/:usuarioPushId', function(req, res) {
    usuariosPushDb.getUsuarioPush(req.params.usuarioPushId, function(err, usuarioPush) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuarioPush == null) {
                res.status(404).send("UsuarioPush no encontrado");
            } else {
                res.json(usuarioPush);
            }
        }
    });
});

// Login
// comprueba si hay algún usuarioPush con el login y password pasados
// si lo encuentra lo devuelve como objeto, si no devuelve nulo.
router.post('/login', function(req, res){
    usuariosPushDb.loginUsuariosPush(req.body.usuarioPush, function(err, usuarioPush){
        if (err){
            res.status(500).send(err.message);
        }else{
            if (usuarioPush == null) {
                res.status(404).send("Login o contraseña incorrectos");
            } else {
                res.json(usuarioPush);
            }
        }
    });
});

// PostUsuarioPush
// permite dar de alta un usuarioPush
router.post('/', function(req, res) {
    usuariosPushDb.postUsuarioPush(req.body.usuarioPush, function(err, usuarioPush) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(usuarioPush);
        }
    });
});



// PutUsuarioPush
// modifica el usuarioPush con el id pasado
router.put('/:usuarioPushId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    usuariosPushDb.getUsuarioPush(req.params.usuarioPushId, function(err, usuarioPush) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (usuarioPush == null) {
                res.status(404).send("UsuarioPush no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                usuariosPushDb.putUsuarioPush(req.params.usuarioPushId, req.body.usuarioPush, function(err, usuarioPush) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(usuarioPush);
                    }
                });
            }
        }
    });
});

// DeleteUsuarioPush
// elimina un usuarioPush de la base de datos
router.delete('/:usuarioPushId', function(req, res) {
    var usuarioPush = req.body.usuarioPush;
    usuariosPushDb.deleteUsuarioPush(req.params.usuarioPushId, usuarioPush, function(err, usuarioPush) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;