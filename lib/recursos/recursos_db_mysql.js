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
function comprobarRecurso(recurso){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof recurso;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && recurso.hasOwnProperty("recursoId"));
	comprobado = (comprobado && recurso.hasOwnProperty("nombre"));
	return comprobado;
}


// getRecursos
// lee todos los registros de la tabla recursos y
// los devuelve como una lista de objetos
module.exports.getRecursos = function(callback){
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


// getRecursosBuscar
// lee todos los registros de la tabla recursos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getRecursosBuscar = function (nombre, callback) {
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

// getRecurso
// busca  el recurso con id pasado
module.exports.getRecurso = function(id, callback){
	var connection = conector.getConnectionPush();
	var recursos = null;
	sql = "SELECT * FROM recursos WHERE recursoId = ?";
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


// postRecurso
// crear en la base de datos el recurso pasado
module.exports.postRecurso = function (recurso, callback){
	if (!comprobarRecurso(recurso)){
		var err = new Error("El recurso pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = conector.getConnectionPush();
	recurso.recursoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO recursos SET ?";
	sql = mysql.format(sql, recurso);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		recurso.recursoId = result.insertId;
		callback(null, recurso);
	});
}

// putRecurso
// Modifica el recurso según los datos del objeto pasao
module.exports.putRecurso = function(id, recurso, callback){
	if (!comprobarRecurso(recurso)){
		var err = new Error("El recurso pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != recurso.recursoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = conector.getConnectionPush();
	sql = "UPDATE recursos SET ? WHERE recursoId = ?";
	sql = mysql.format(sql, [recurso, recurso.recursoId]);
	connection.query(sql, function(err, result){
		conector.closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null, recurso);
	});
}

// deleteRecurso
// Elimina el recurso con el id pasado
module.exports.deleteRecurso = function(id, recurso, callback){
	var connection = conector.getConnectionPush();
	var recurso = undefined;
	sql = "SELECT * from recursos WHERE recursoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			return callback(err);
		}
		recurso = result[0];
		sql = "DELETE from recursos WHERE recursoId = ?";
		sql = mysql.format(sql, id);
		connection.query(sql, function(err, result){
			conector.closeConnection(connection);
			if (err){
				return callback(err);
			}
			callback(null, recurso);
		});
			
	});
}