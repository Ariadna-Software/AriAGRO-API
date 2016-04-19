var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');

module.exports.getFacturasGasolineraCliente = function(codclien, callback) {
    var facturas = [];
    if (config.database_gasolinera == "") {
        // no hay gasolinera, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }
    var sql = "SELECT fc.codsocio, fc.letraser, fc.numfactu, fc.fecfactu, ";
    sql += " (COALESCE(fc.baseimp1,0) + COALESCE(fc.baseimp2,0) + COALESCE(fc.baseimp3,0)) AS bases,";
    sql += " (COALESCE(fc.impoiva1,0) + COALESCE(fc.impoiva2,0) + COALESCE(fc.impoiva3,0)) AS cuotas,";
    sql += " fc.impuesto, fc.totalfac,";
    sql += " fl.numlinea, fl.numalbar, fl.fecalbar,";
    sql += " a.nomartic, fl.cantidad, fl.preciove, fl.implinea";
    sql += " FROM schfac AS fc";
    sql += " LEFT JOIN slhfac AS fl ON fl.letraser = fc.letraser AND fl.numfactu = fc.numfactu AND fl.fecfactu = fc.fecfactu";
    sql += " LEFT JOIN sartic AS a ON a.codartic = fl.codartic";
    sql += " WHERE fc.codsocio = ?"
    sql += " ORDER BY fc.fecfactu DESC, fc.letraser, fc.numfactu"
    sql = mysql.format(sql, codclien);
    var connection = conector.getConnectionGasolinera();
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
    var letraserAnt = "";
    var numfactuAnt = 0;
    var fecfactuAnt = 0;
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];
        if (letraserAnt != factura.letraser || numfactuAnt != factura.numfactu) {
            // es una factura nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                fcJs.push(cabJs);
            }
            cabJs = {
                codsocio: factura.codsocio,
                letraser: factura.letraser,
                numfactu: factura.numfactu,
                fecfactu: factura.fecfactu,
                bases: factura.bases,
                cuotas: factura.cuotas,
                impuesto: factura.impuesto,
                totalfac: factura.totalfac,
                lineas: []
            };
            letraserAnt = factura.letraser;
            numfactuAnt = factura.numfactu;
            fecfactuAnt = factura.fecfactu;
        }
        // siempre se procesa una linea
        if (factura.numlinea) {
            linJs = {
                numlinea: factura.numlinea,
                numalbar: factura.numalbar,
                fecalbar: factura.fecalbar,
                nomartic: factura.nomartic,
                cantidad: factura.cantidad,
                preciove: factura.preciove,
                implinea: factura.implinea
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}