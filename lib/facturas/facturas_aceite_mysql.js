var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
//var config = require('../../config/mysql_config.json');
//var cfg = require('../../config/config.json');
var Stimulsoft = require('stimulsoft-reports-js');
var fs = require("fs");
var moment = require('moment');





module.exports.getFacturasAceiteCliente = function(codsocio, year, callback) {
    var facturas = [];

    if (!conector.controlDatabaseAceite()){
        // no hay tienda, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }

    let sql = `SELECT
    f.codtipom AS codtipom,
    f.numfactu AS numfactu,
    f.fecfactu AS fecfactu,
    (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,
    (COALESCE(f.impoiva1,0) + COALESCE(f.impoiva2,0) + COALESCE(f.impoiva3,0)) AS cuotas,
    f.totalfac AS totalfac,
    lf.numalbar AS numalbar,
    lf.numlinea AS numlinea,
    lf.codvarie AS codvarie,
    v.nomvarie AS nomvarie,
    lf.precioar AS precioar,
    lf.cantidad AS cantidad,
    lf.dtolinea AS dtolinea,
    lf.importel AS importel
    FROM rbodfacturas AS f
    LEFT JOIN rbodfacturas_lineas AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)
    LEFT JOIN variedades AS v ON v.codvarie = lf.codvarie 
    WHERE f.codsocio = ${codsocio} AND YEAR(f.fecfactu) = ${year}
    ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.numalbar, lf.numlinea;`
    

    var connection = conector.getConnectionAceite();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        // hay que procesar a JSON
        return callback(null, fnFacturasFromDbToJson(result));
    });
};




var fnFacturasFromDbToJson = function(facturas) {
    var fcJs = [];
    var cabJs = null;
    var linJs = null;
    var numfacAnt = 0;
    var tipomAnt = 0;
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];
        if (numfacAnt != factura.numfactu || tipomAnt != factura.codtipom) {
            // es una factura nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                fcJs.push(cabJs);
            }
            cabJs = {
                codtipom: factura.codtipom,
                numfactu: factura.codtipom + "-" + factura.numfactu,
                numfactuSin: factura.numfactu,
                fecfactu: factura.fecfactu,
                bases: factura.bases,
                cuotas: factura.cuotas,
                totalfac: factura.totalfac,
                lineas: []
            };
            numfacAnt = factura.numfactu;
            tipomAnt = factura.codtipom;
        }
        // siempre se procesa una linea
        if (factura.numlinea) {
            linJs = {
                numalbar: factura.numalbar,
                numlinea: factura.numlinea,
                codvarie: factura.codvarie,
                nomvarie: factura.nomvarie,
                precioar: factura.precioar,
                cantidad: factura.cantidad,
                dtolinea: factura.dtolinea,
                importel: factura.importel
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}
