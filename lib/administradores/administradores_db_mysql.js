// administradores_db_mysql
// Manejo de la tabla administradores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var conector = require('../comun/conector_mysql');


var sql = "";

// comprobarAdministrador
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAdministrador(administrador){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof administrador;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && administrador.hasOwnProperty("administradorId"));
	comprobado = (comprobado && administrador.hasOwnProperty("nombre"));
	comprobado = (comprobado && administrador.hasOwnProperty("login"));
	comprobado = (comprobado && administrador.hasOwnProperty("password"));
	return comprobado;
}


// getAdministradores
// lee todos los registros de la tabla administradores y
// los devuelve como una lista de objetos
module.exports.getAdministradores = function(callback){
	var connection = conector.getConnectionPush();
	var administradores = null;
	sql = "SELECT * FROM administradores";
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		administradores = result;
		callback(null, administradores);
	});	
	
}

// loginAdministradores
// busca un administrador con el login y contraseña pasados
// si lo encuentra lo devuelve, si no devuelve nulo.
module.exports.loginAdministradores = function(administrador, callback){
	var connection = conector.getConnectionPush();
	if (administrador && administrador.login && administrador.password){
		var sql = "SELECT * FROM administradores WHERE login = ? AND password = ?";
		sql = mysql.format(sql, [administrador.login, administrador.password]);
		connection.query(sql, function(err, result){
			conector.closeConnection(connection);
			if (err){
				return callback(err, null);
			}
			if (result.length == 0){
				return callback(null, null);
			}
			return callback(null, result[0]);
		});
	}else{
		var err = new Error('API: No se ha proporcionado un objeto administrador con login y contraseña');
		return callback(err, null);
	}
	return;
}

// getAdministradoresBuscar
// lee todos los registros de la tabla administradores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getAdministradoresBuscar = function (nombre, callback) {
    var connection = conector.getConnectionPush();
    var administradores = null;
    var sql = "SELECT * FROM administradores";
    if (nombre !== "*") {
        sql = "SELECT * FROM administradores WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
    	conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        administradores = result;
        callback(null, administradores);
    });
}

// getAdministrador
// busca  el administrador con id pasado
module.exports.getAdministrador = function(id, callback){
	var connection = conector.getConnectionPush();
	var administradores = null;
	sql = "SELECT * FROM administradores WHERE administradorId = ?";
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


// postAdministrador
// crear en la base de datos el administrador pasado
module.exports.postAdministrador = function (administrador, callback){
	if (!comprobarAdministrador(administrador)){
		var err = new Error("El administrador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = conector.getConnectionPush();
	administrador.administradorId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO administradores SET ?";
	sql = mysql.format(sql, administrador);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		administrador.administradorId = result.insertId;
		callback(null, administrador);
	});
}

// putAdministrador
// Modifica el administrador según los datos del objeto pasao
module.exports.putAdministrador = function(id, administrador, callback){
	if (!comprobarAdministrador(administrador)){
		var err = new Error("El administrador pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != administrador.administradorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = conector.getConnectionPush();
	sql = "UPDATE administradores SET ? WHERE administradorId = ?";
	sql = mysql.format(sql, [administrador, administrador.administradorId]);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null, administrador);
	});
}

// deleteAdministrador
// Elimina el administrador con el id pasado
module.exports.deleteAdministrador = function(id, administrador, callback){
	var connection = conector.getConnectionPush();
	sql = "DELETE from administradores WHERE administradorId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null);
	});
}