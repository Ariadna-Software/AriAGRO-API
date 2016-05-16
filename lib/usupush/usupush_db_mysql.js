// usuariosPush_db_mysql
// Manejo de la tabla usuariosPush en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var conector = require('../comun/conector_mysql');


var sql = "";

// comprobarUsuarioPush
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarUsuarioPush(usuarioPush){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof usuarioPush;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && usuarioPush.hasOwnProperty("usuarioPushId"));
	comprobado = (comprobado && usuarioPush.hasOwnProperty("nif"));
	comprobado = (comprobado && usuarioPush.hasOwnProperty("login"));
	comprobado = (comprobado && usuarioPush.hasOwnProperty("password"));
	return comprobado;
}


// getUsuariosPush
// lee todos los registros de la tabla usuariosPush y
// los devuelve como una lista de objetos
module.exports.getUsuariosPush = function(callback){
	var connection = conector.getConnectionPush();
	var usuariosPush = null;
	sql = "SELECT * FROM usuariosPush ORDER BY nombre";
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		usuariosPush = result;
		callback(null, usuariosPush);
	});	
	
}

// getUsuariosPushLogados
// lee todos los registros de la tabla usuariosPush y
// los devuelve como una lista de objetos
module.exports.getUsuariosPushLogados = function(callback){
	var connection = conector.getConnectionPush();
	var usuariosPush = null;
	sql = "SELECT * FROM usuariosPush WHERE NOT playerId IS NULL ORDER BY nombre";
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		usuariosPush = result;
		callback(null, usuariosPush);
	});	
	
}

// [export] getLogin
// 
module.exports.getLogin = function(login, password, callback) {
    var usuario = null;
    var sql = "SELECT * FROM usuariospush WHERE login = ? AND password = ?";
    sql = mysql.format(sql, [login, password]);
    var connection = conector.getConnectionPush();
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

// getUsuariosPushBuscar
// lee todos los registros de la tabla usuariosPush cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getUsuariosPushBuscar = function (nombre, callback) {
    var connection = conector.getConnectionPush();
    var usuariosPush = null;
    var sql = "SELECT * FROM usuariosPush ORDER BY nombre";
    if (nombre !== "*") {
        sql = "SELECT * FROM usuariosPush WHERE nombre LIKE ? ORDER BY nombre";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
    	conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        usuariosPush = result;
        callback(null, usuariosPush);
    });
}

// getUsuariosPushBuscarLogados
// lee todos los registros de la tabla usuariosPush cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getUsuariosPushBuscarLogados = function (nombre, callback) {
    var connection = conector.getConnectionPush();
    var usuariosPush = null;
    var sql = "SELECT * FROM usuariosPush WHERE NOT playerId IS NULL ORDER BY nombre";
    if (nombre !== "*") {
        sql = "SELECT * FROM usuariosPush WHERE NOT playerId IS NULL AND nombre LIKE ? ORDER BY nombre";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
    	conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        usuariosPush = result;
        callback(null, usuariosPush);
    });
}

// getUsuarioPush
// busca  el usuarioPush con id pasado
module.exports.getUsuarioPush = function(id, callback){
	var connection = conector.getConnectionPush();
	var usuariosPush = null;
	sql = "SELECT * FROM usuariosPush WHERE usuarioPushId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
		}
		callback(null, result[0]);
	});
}


// postUsuarioPush
// crear en la base de datos el usuarioPush pasado
module.exports.postUsuarioPush = function (usuarioPush, callback){
	if (!comprobarUsuarioPush(usuarioPush)){
		var err = new Error("El usuarioPush pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = conector.getConnectionPush();
	usuarioPush.usuarioPushId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO usuariosPush SET ?";
	sql = mysql.format(sql, usuarioPush);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		usuarioPush.usuarioPushId = result.insertId;
		callback(null, usuarioPush);
	});
}

// putUsuarioPush
// Modifica el usuarioPush según los datos del objeto pasao
module.exports.putUsuarioPush = function(id, usuarioPush, callback){
	if (!comprobarUsuarioPush(usuarioPush)){
		var err = new Error("El usuarioPush pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != usuarioPush.usuarioPushId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = conector.getConnectionPush();
	sql = "UPDATE usuariosPush SET ? WHERE usuarioPushId = ?";
	sql = mysql.format(sql, [usuarioPush, usuarioPush.usuarioPushId]);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null, usuarioPush);
	});
}

// deleteUsuarioPush
// Elimina el usuarioPush con el id pasado
module.exports.deleteUsuarioPush = function(id, usuarioPush, callback){
	var connection = conector.getConnectionPush();
	sql = "DELETE from usuariosPush WHERE usuarioPushId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null);
	});
}