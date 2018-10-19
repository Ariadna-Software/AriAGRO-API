var express = require('express');
var router = express.Router();
var facturasTiendaMysql = require('./facturas_tienda_mysql');
var facturasTelefoniaMysql = require('./facturas_telefonia_mysql');
var facturasGasolineraMysql = require('./facturas_gasolinera_mysql');
var facturasTratamientosMysql = require('./facturas_tratamientos_mysql');
var facturasVariasMysql =  require('./facturas_varias_mysql');  
var envCorreo = require('../comun/enviar_correos')

// Devuelve todas las facturas de un cliente determinado (Tienda)
router.get('/tienda/:codclien/:year', function(req, res) {
    var codclien = req.params.codclien;
    var year = req.params.year;
    if (codclien && year) {
        facturasTiendaMysql.getFacturasTiendaCliente(codclien, year, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

// Devuelve todas las facturas de un cliente determinado (Tratamientos)
router.get('/tratamientos/:codclien/:year/:codsocio/:campanya', function(req, res) {
    var codclien = req.params.codclien;
    var year = req.params.year;
    var codsocio = req.params.codsocio;
    var campanya = req.params.campanya;
    if (codclien && year) {
        facturasTratamientosMysql.getFacturasTratamientosCliente(codclien, year, codsocio, campanya, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

// Devuelve todas las facturas de un cliente determinado (Telefonía)
router.get('/telefonia/:codclien/:year', function(req, res) {
    var codclien = req.params.codclien;
    var year = req.params.year;
    if (codclien && year) {
        facturasTelefoniaMysql.getFacturasTelefoniaCliente(codclien, year, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

// Devuelve todas las facturas de un cliente determinado (Gasolinera)
router.get('/gasolinera/:codclien/:year', function(req, res) {
    var codclien = req.params.codclien;
    var year = req.params.year;
    if (codclien && year) {
        facturasGasolineraMysql.getFacturasGasolineraCliente(codclien, year, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

router.get('/varias/:campanya', function(req, res) {
    
    var campanya = req.params.campanya;
    if (campanya) {
        facturasVariasMysql.getFacturasVariasCliente(campanya, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

// --------------------INFORME FACTURA -----------------------------

//Envio de pdf por correo de gasolnera
router.post('/gasolinera/correo/', function(req, res) {
    var codclien = req.body.codclien;
    var year = req.body.fecfactu;
    var numfactu = req.body.numfactu;
    var letraser = req.body.letraser;
    var informe = req.body.informe;
    if (codclien && year) {
        facturasGasolineraMysql.postPrepararCorreosGasol(codclien, year, numfactu, letraser, informe, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});


//Envio de pdf por correo de tienda
router.post('/tienda/correo/esto', function(req, res) {
    var codclien = req.body.codclien;
    var year = req.body.fecfactu;
    var numfactu = req.body.numfactu;
    var letraser = req.body.letraser;
    var informe = req.body.informe;
    if (codclien && year) {
        facturasTiendaMysql.postPrepararCorreosTienda(codclien, year, numfactu, letraser, informe, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});



 router.post('/enviar/correo/comun', function (req, res) {
    var numfactu = req.body.numfactu;
    var email = req.body.email;
    var ruta = req.body.ruta;
    var coop = req.body.coop;
    var codtipom = req.body.codtipom;
    envCorreo.crearCorreosAEnviar(numfactu, email, ruta, coop, codtipom, (err, data) => {
        if (err) return res.status(500).send(err.message);
        var msg = data;
        res.json(msg);
    })
 });
 
 
module.exports = router;
