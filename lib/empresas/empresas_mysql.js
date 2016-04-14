//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');


// [export] getLogin
// 
module.exports.getEmpresa = function(callback) {
    var usuario = null;
    var sql = "SELECT * FROM empresas"
    var connection = conector.getConnectionAriagro();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        var empresa = null;
        if (result.length > 0){
            empresa = result[0];
        }
        return callback(null, empresa);
    });

};
