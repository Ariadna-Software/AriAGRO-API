//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');


// [export] getLogin
// 
module.exports.getCamposSocio = function(codsocio, campanya, callback) {
    var usuario = null;
    var sql = "SELECT c.codsocio, c.codcampo, nomvarie,";
    sql += " nomparti, poligono, parcela, recintos,";
    sql += " COALESCE(k.kilos,0) AS kilostot,";
    sql += " h.numalbar, h.fecalbar, numcajon, kilosnet";
    sql += " FROM rcampos AS c";
    sql += " LEFT JOIN variedades AS v ON v.codvarie = c.codvarie";
    sql += " LEFT JOIN rpartida AS p ON p.codparti = c.codparti";
    sql += " LEFT JOIN (SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta GROUP BY codcampo) AS k ON k.codcampo = c.codcampo";
    sql += " LEFT JOIN rhisfruta AS h ON h.codcampo = c.codcampo";
    sql += " WHERE c.fecbajas IS NULL ";
    sql += " AND c.codsocio = ?";
    sql += " ORDER BY c.codcampo, h.fecalbar DESC"
    sql = mysql.format(sql, codsocio);
    var connection = conector.getConnectionCampanya(campanya);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, fnCamposFromDbToJson(result));
    });

};

var fnCamposFromDbToJson = function (campos) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var codcampoAnt = 0;
    for (var i = 0; i < campos.length; i++) {
        var c = campos[i];
        if (codcampoAnt != c.codcampo) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                codsocio: c.codsocio,
                codcampo: c.codcampo,
                nomvarie: c.nomvarie,
                nomparti: c.nomparti,
                poligono: c.poligono,
                parcela: c.parcela,
                recintos: c.recintos,
                kilos: c.kilostot,
                entradas: []
            };
            codcampoAnt = c.codcampo;
        }
        // siempre se procesa una linea
        if (c.numalbar) {
            linJs = {
                numalbar: c.numalbar,
                fecalbar: c.fecalbar,
                numcajon: c.numcajon,
                kilosnet: c.kilosnet
            };
            cabJs.entradas.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}