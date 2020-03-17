//-----------------------------------------------------------------
// campanyas_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
//var cfg = require('../../config/mysql_config.json');


// [export] getLogin
// 
module.exports.getCampanyas = function(callback) {
    if (!conector.controlDatabaseAriagro()) {
        return callback(null, []);
    }
    var usuario = null;
    var sql = "SELECT 0, aaa.orden, aaa.codempre, aaa.nomempre,aaa.nomresum,aaa.Usuario,aaa.Pass,aaa.ariagro";
    sql += " FROM usuarios.empresasariagro aaa WHERE codempre = 0 AND Pass IS NULL";
    sql += " UNION";
    sql += " SELECT 1, aaa.orden, aaa.codempre, aaa.nomempre,aaa.nomresum,aaa.Usuario,aaa.Pass,aaa.ariagro";
    sql += " FROM usuarios.empresasariagro aaa";
    sql += " WHERE codempre <> 0  AND Pass IS NULL";
    sql += " ORDER BY 1, 2, 3 DESC";
    var connection = conector.getConnectionUsuarios();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (process.env.CAMPANYA_UNICA && process.env.CAMPANYA_UNICA == 'S') {
            result = [];
        }
        return callback(null, result);
    });

};


module.exports.getCampanyaActual = function(callback) {
    if (!conector.controlDatabaseAriagro()) {
        return callback(null, []);
    }
    var usuario = null;
    var sql = "SELECT 0, aaa.orden, aaa.codempre, aaa.nomempre,aaa.nomresum,aaa.Usuario,aaa.Pass,aaa.ariagro";
    sql += " FROM usuarios.empresasariagro aaa WHERE codempre = 0";
    sql += " UNION";
    sql += " SELECT 1, aaa.orden, aaa.codempre, aaa.nomempre,aaa.nomresum,aaa.Usuario,aaa.Pass,aaa.ariagro";
    sql += " FROM usuarios.empresasariagro aaa";
    sql += " WHERE codempre <> 0 AND usuario = '*'";
    sql += " ORDER BY 1, 2, 3 DESC";
    var connection = conector.getConnectionUsuarios();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });

};
