//-----------------------------------------------------------------
// campanyas_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');


// [export] getLogin
// 
module.exports.getCampanyas = function(callback) {
    var usuario = null;
    var sql = "SELECT * FROM empresasariagro  WHERE usuario <> '*' ORDER BY orden, nomresum"
    var connection = conector.getConnectionUsuarios();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });

};
