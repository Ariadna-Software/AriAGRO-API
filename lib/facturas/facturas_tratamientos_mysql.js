var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');

module.exports.getFacturasTratamientosCliente = function(codclien, year, codsocio, campanya, callback) {
    var facturas = [];

    if (!conector.controlDatabaseTratamientos()) {
        // no hay tienda, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }
    
    var sql = "";
    var connection = null;
    if (config.tratamientos.database == "ariagro") {
        // Cooperativa no Alzicoop
        sql = "SELECT";
        sql += " par.numparte AS numparte,";
        sql += " par.codtrata AS codtrata,";
        sql += " tra.nomtrata AS nomtrata,";
        sql += " par.codcampo AS codcampo,";
        sql += " rp.nomparti AS nomparti,";
        sql += " rc.codvarie AS codvarie,";
        sql += " v.nomvarie AS nomvarie,";
        sql += " f.codtipom AS codtipom,";
        sql += " f.numfactu AS numfactu,";
        sql += " t.letraser AS letraser,";
        sql += " f.fecfactu AS fecfactu,";
        sql += " f.codsocio AS codsocio,";
        sql += " (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,";
        sql += " (COALESCE(f.impoiva1,0) + COALESCE(f.impoiva2,0) + COALESCE(f.impoiva3,0) + COALESCE(f.imporec1,0) + COALESCE(f.imporec2,0) + COALESCE(f.imporec3,0)) AS cuotas,";
        sql += " SUM(f.totalfac) AS totalfac,";
        sql += " lf.numlinea AS numlinea,";
        sql += " lf.codartic AS codartic,";
        sql += " a.nomartic AS nomartic,";
        sql += " SUM(lf.cantidad) AS cantidad,";
        sql += " SUM(lf.importel) AS importel,";
        sql += " lf.preciove AS precioar";
        sql += " FROM advfacturas AS f";
        sql += " LEFT JOIN advfacturas_lineas AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN advfacturas_partes AS par ON (par.codtipom = lf.codtipom AND par.numfactu = lf.numfactu AND par.fecfactu = lf.fecfactu)";
        sql += " LEFT JOIN advtrata AS tra ON tra.codtrata = par.codtrata";
        sql += " LEFT JOIN rcampos AS rc ON rc.codcampo = par.codcampo";
        sql += " LEFT JOIN rpartida AS rp ON rp.codparti = rc.codparti";
        sql += " LEFT JOIN variedades AS v ON v.codvarie = rc.codvarie";
        sql += " LEFT JOIN advartic AS a ON (a.codartic = lf.codartic)";
        sql += " LEFT JOIN " + config.usuarios.database + ".stipom AS t ON (t.codtipom = f.codtipom)";
        sql += " WHERE f.codsocio = ? AND f.numfactu = 251184";
        sql += " GROUP BY par.numparte, a.codartic";
        sql += " ORDER BY f.numfactu, par.numparte, par.codcampo"
        sql = mysql.format(sql, codsocio);
        connection = conector.getConnectionTratamientos(campanya);
    } else {
        // ALZICOOP
        sql = "SELECT";
        sql += " f.codtipom AS codtipom,";
        sql += " f.numfactu AS numfactu,";
        sql += " f.fecfactu AS fecfactu,";
        sql += " st.letraser AS letraser,";
        sql += " (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,";
        sql += " (COALESCE(f.imporiv1,0) + COALESCE(f.imporiv2,0) + COALESCE(f.imporiv3,0)";
        sql += " + COALESCE(f.imporiv1re,0) + COALESCE(f.imporiv2re,0) + COALESCE(f.imporiv3re,0)) AS cuotas,";
        sql += " f.totalfac AS totalfac,";
        sql += " lf.codtipoa AS codtipoa,";
        sql += " lf.numalbar AS numalbar,"
        sql += " lf.numlinea AS numlinea,";
        sql += " lf.codartic AS codartic,";
        sql += " lf.nomartic AS nomartic,";
        sql += " lf.precioar AS precioar,";
        sql += " lf.cantidad AS cantidad,";
        sql += " lf.dtoline1 AS dtoline1,";
        sql += " lf.dtoline2 AS dtoline2,";
        sql += " lf.importel AS importel";
        sql += " FROM scafac AS f";
        sql += " LEFT JOIN slifac AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN stipom AS st ON st.codtipom = f.codtipom"
        sql += " WHERE f.codclien = ? AND YEAR(f.fecfactu) = ?";
        sql += " AND f.codtipom IN (" + conector.sqlInString(config.tratamientos.tipo_fac_adv) + ")";
        sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.codtipoa, lf.numalbar, lf.numlinea;";
        sql = mysql.format(sql, [codclien, year]);
        connection = conector.getConnectionTratamientos();
    }
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        // hay que procesar a JSON dependiendo de la cooperativa
        if (config.tratamientos.database == "ariagro") {
            return callback(null, fnFacturasFromDbToJsonNoAlizcoop(result));
        }else {
            return callback(null, fnFacturasFromDbToJson(result));
        }
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
                numfactu: factura.letraser + "-" + factura.numfactu,
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
                codtipoa: factura.codtipoa,
                numalbar: factura.numalbar,
                numlinea: factura.numlinea,
                codartic: factura.codartic,
                nomartic: factura.nomartic,
                precioar: factura.precioar,
                cantidad: factura.cantidad,
                dtoline1: factura.dtoline1,
                dtoline2: factura.dtoline2,
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


var fnFacturasFromDbToJsonNoAlizcoop = function(facturas) {
    var fcJs = [];
    var cabJs = null;
    var linJs = null;
    var partJs = [];
    var numfacAnt = 0;
    var tipomAnt = 0;
    var antNumPart = 0;
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];
        if (numfacAnt != factura.numfactu ||  tipomAnt != factura.codtipom) {
            // es una factura nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                fcJs.push(cabJs);
            }
            cabJs = {
                codtipom: factura.codtipom,
                numfactu: factura.letraser + "-" + factura.numfactu,
                fecfactu: factura.fecfactu,
                bases: factura.bases,
                cuotas: factura.cuotas,
                totalfac: factura.totalfac,
                partes: []
            };
            numfacAnt = factura.numfactu;
            tipomAnt = factura.codtipom;
            }
             // se procesan los partes
            if (antNumPart != factura.numparte) {
                partJs = {
                    numparte: factura.numparte,
                    codtrata: factura.codtrata,
                    nomtrata: factura.nomtrata,
                    codcampo: factura.codcampo,
                    nomparti: factura.nomparti,
                    codvarie: factura.codvarie,
                    nomvarie: factura.nomvarie,
                    lineas: []

                };
                cabJs.partes.push(partJs);
                antNumPart = factura.numparte;
            
            }
            // siempre se procesa una linea
            if (factura.codartic) {
                linJs = {
                    codartic: factura.codartic,
                    nomartic: factura.nomartic,
                    precioar: factura.precioar,
                    cantidad: factura.cantidad,
                    importel: factura.importel

                };
                partJs.lineas.push(linJs);
            }
            
    }
    
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}
