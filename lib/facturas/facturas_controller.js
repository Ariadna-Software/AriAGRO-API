var express = require('express');
var router = express.Router();
var facturasTiendaMysql = require('./facturas_tienda_mysql');
var facturasTelefoniaMysql = require('./facturas_telefonia_mysql');
var facturasGasolineraMysql = require('./facturas_gasolinera_mysql');

// Devuelve todas las facturas de un cliente determinado (Tienda)
router.get('/tienda/:codclien', function(req, res) {
    var codclien = req.params.codclien;
    if (codclien) {
        facturasTiendaMysql.getFacturasTiendaCliente(codclien, function(err, facturas) {
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
router.get('/telefonia/:codclien', function(req, res) {
    var codclien = req.params.codclien;
    if (codclien) {
        facturasTelefoniaMysql.getFacturasTelefoniaCliente(codclien, function(err, facturas) {
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
router.get('/gasolinera/:codclien', function(req, res) {
    var codclien = req.params.codclien;
    if (codclien) {
        facturasGasolineraMysql.getFacturasGasolineraCliente(codclien, function(err, facturas) {
            if (err) {
                return res.status(500).send(err.message);
            }
            return res.json(facturas)
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});


//
module.exports = router;
