var express = require('express');
var router = express.Router();
var facturasTiendaMysql = require('./facturas_tienda_mysql');
var facturasTelefoniaMysql = require('./facturas_telefonia_mysql');
var facturasGasolineraMysql = require('./facturas_gasolinera_mysql');

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


//
module.exports = router;
