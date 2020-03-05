// recursos_db_mysql
// Manejo de la tabla recursos en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var conector = require('../comun/conector_mysql');


var sql = "";

// comprobarRecurso
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarRecurso(enlace){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof enlace;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && enlace.hasOwnProperty("enlaceId"));
	comprobado = (comprobado && enlace.hasOwnProperty("nombre"));
	return comprobado;
}


// getEnlaces
// lee todos los registros de la tabla recursos y
// los devuelve como una lista de objetos
module.exports.getEnlaces = function(callback){
	var connection = conector.getConnectionPush();
	var recursos = null;
	sql = "SELECT * FROM recursos";
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		recursos = result;
		callback(null, recursos);
	});	
	
}


// getEnlacesBuscar
// lee todos los registros de la tabla recursos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEnlacesBuscar = function (nombre, callback) {
    var connection = conector.getConnectionPush();
    var recursos = null;
    var sql = "SELECT * FROM recursos";
    if (nombre !== "*") {
        sql = "SELECT * FROM recursos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
    	conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        recursos = result;
        callback(null, recursos);
    });
}

// getEnlace
// busca  el enlace con id pasado
module.exports.getEnlace = function(id, callback){
	var connection = conector.getConnectionPush();
	var recursos = null;
	sql = "SELECT * FROM recursos WHERE enlaceId = ?";
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


// postEnlace
// crear en la base de datos el enlace pasado
module.exports.postEnlace = function (enlace, callback){
	if (!comprobarRecurso(enlace)){
		var err = new Error("El enlace pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = conector.getConnectionPush();
	enlace.enlaceId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO recursos SET ?";
	sql = mysql.format(sql, enlace);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		enlace.enlaceId = result.insertId;
		callback(null, enlace);
	});
}

// putEnlace
// Modifica el enlace según los datos del objeto pasao
module.exports.putEnlace = function(id, enlace, callback){
	if (!comprobarRecurso(enlace)){
		var err = new Error("El enlace pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != enlace.enlaceId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = conector.getConnectionPush();
	sql = "UPDATE recursos SET ? WHERE enlaceId = ?";
	sql = mysql.format(sql, [enlace, enlace.enlaceId]);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null, enlace);
	});
}

// deleteEnlace
// Elimina el enlace con el id pasado
module.exports.deleteEnlace = function(id, enlace, callback){
	var connection = conector.getConnectionPush();
	var enlace = undefined;
	sql = "SELECT * from recursos WHERE enlaceId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			return callback(err);
		}
		enlace = result[0];
		sql = "DELETE from recursos WHERE enlaceId = ?";
		sql = mysql.format(sql, id);
		connection.query(sql, function(err, result){
			conector.closeConnection(connection);
			if (err){
				return callback(err);
			}
			callback(null, enlace);
		});
			
	});
}