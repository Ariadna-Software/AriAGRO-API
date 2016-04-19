//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');


// [export] getLogin
// 
module.exports.getLogin = function(login, password, callback) {
    var usuario = null;
    var sql = "SELECT * FROM rsocios WHERE applogin = ? AND apppassword = ?";
    sql = mysql.format(sql, [login, password]);
    var connection = conector.getConnectionAriagro();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result && (result.length > 0)) {
            usuario = result[0];
        }
        return callback(null, usuario);
    });

};


module.exports.getCodigos = function(codsocio, callback) {
    // por defecto todos los códigos son iguales al de socio
    // 
    var codigos = {
        "codsocio": codsocio,
        "codtienda": codsocio,
        "codtelefonia": codsocio,
        "codgasolinera": codsocio
    };
    if (config.database_gessocial == "") {
        // no hay gestión social, devolvemos los valores
        // por defecto
        return callback(null, codigos);
    }
    var sql = "SELECT " + codsocio + " AS codsocio, ";
    sql += " idAsoc AS codtienda, idasoc AS codtelefonia, idasoc AS codgasolinera";
    sql += " FROM asociados WHERE CodSocEuroagro = ?";
    sql = mysql.format(sql, codsocio);
    var connection = conector.getConnectionGesSocial();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result && (result.length > 0)) {
            codigos = result[0];
        }
        return callback(null, codigos);
    });

};
