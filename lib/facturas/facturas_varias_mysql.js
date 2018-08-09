var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');

module.exports.getFacturasVariasCliente = function(campanya, callback) {
    var facturas = [];

    if (!conector.controlDatabaseTelefonia()){
        // no hay telefonia, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }    
    
    var sql = "SELECT";
    sql += " f.codtipom AS codtipom,";
    sql += " f.numfactu AS numfactu,";
    sql += " f.fecfactu AS fecfactu,";
    sql += " t.letraser AS letraser,";
    sql += " st.nomconce AS nomconce,";
    sql += " (COALESCE(f.baseiva1,0) + COALESCE(f.baseiva2,0) + COALESCE(f.baseiva3,0)) AS bases,";
    sql += " (COALESCE(f.impoiva1,0) + COALESCE(f.impoiva2,0) + COALESCE(f.impoiva3,0) ";
    sql += " + COALESCE(f.imporec1,0) + COALESCE(f.imporec2,0) + COALESCE(f.imporec3,0)) AS cuotas,";
    sql += " f.totalfac AS totalfac,";
    sql += " lf.codtipom AS codtipom,"
    sql += " lf.numlinea AS numlinea,";
    sql += " lf.codconce AS codconce,";
    sql += " lf.ampliaci AS ampliaci,"
    sql += " lf.importe AS importe,";
    sql += " lf.cantidad AS cantidad,";
    sql += " lf.precio AS precio,"
    sql += " lf.tipoiva AS tipoiva"
    sql += " FROM fvarcabfact  AS f";
    sql += "  LEFT JOIN fvarlinfact AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
    sql += " LEFT JOIN fvarconce AS st ON st.codconce = lf.codconce"
    sql += " LEFT JOIN " + config.usuarios.database + ".stipom AS t ON (t.codtipom = f.codtipom)";
    sql += " WHERE f.codclien is not null";
    // como hay gente que tiene la telefonía y la tienda en la misma base de datos lo que hacemos es
    // buscar las específicas de tipo si nos las han puesto.
    //if (config.telefonia.tipo_fac_telefonia && config.telefonia.tipo_fac_telefonia.length > 0){
    //    sql += " AND f.codtipom IN (" + conector.sqlInString(config.telefonia.tipo_fac_telefonia) + ")";
    //}
    sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.numlinea;";
    sql = mysql.format(sql);
    var connection = conector.getConnectionCampanya(campanya);
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
                codtipom: factura.codtipom,
                numlinea: factura.numlinea,
                codconce: factura.codconce,
                nomconce: factura.nomconce,
                ampliaci: factura.ampliaci,
                importel: factura.importe,
                cantidad: factura.cantidad,
                precioar: factura.precio,
                tipoiva: factura.tipoiva
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}
