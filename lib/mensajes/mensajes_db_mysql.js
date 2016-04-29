// mensajes_db_mysql
// Manejo de la tabla mensajes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var conector = require('../comun/conector_mysql');
var http = require('http');
var async = require('async');
var parametrosDb = require('../parametros/parametros_db_mysql');

var sql = "";

// comprobarMensaje
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarMensaje(mensaje) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof mensaje;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && mensaje.hasOwnProperty("mensajeId"));
    comprobado = (comprobado && mensaje.hasOwnProperty("asunto"));
    comprobado = (comprobado && mensaje.hasOwnProperty("texto"));
    comprobado = (comprobado && mensaje.hasOwnProperty("fecha"));
    return comprobado;
}


// getMensajes
// lee todos los registros de la tabla mensajes y
// los devuelve como una lista de objetos
module.exports.getMensajes = function(callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    sql = "SELECT * FROM mensajes ORDER BY fecha DESC";
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });

}

// getMensajesBuscar
// lee todos los registros de la tabla mensajes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getMensajesBuscar = function(nombre, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    var sql = "SELECT * FROM mensajes ORDER BY fecha DESC";
    if (nombre !== "*") {
        sql = "SELECT * FROM mensajes WHERE asunto LIKE ? ORDER BY fecha DESC";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });
}

// getMensaje
// busca  el mensaje con id pasado
module.exports.getMensaje = function(id, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    sql = "SELECT * FROM mensajes WHERE mensajeId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postMensaje
// crear en la base de datos el mensaje pasado
module.exports.postMensaje = function(mensaje, callback) {
    if (!comprobarMensaje(mensaje)) {
        var err = new Error("El mensaje pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = conector.getConnectionPush();
    mensaje.mensajeId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO mensajes SET ?";
    sql = mysql.format(sql, mensaje);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        mensaje.mensajeId = result.insertId;
        callback(null, mensaje);
    });
}

// putMensaje
// Modifica el mensaje según los datos del objeto pasao
module.exports.putMensaje = fnPutMensaje;

// deleteMensaje
// Elimina el mensaje con el id pasado
module.exports.deleteMensaje = fnDeleteMensaje;

// 
module.exports.postSendMensaje = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIds(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        fnStoreMensaje(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            var mensaje2 = res;
            parametrosDb.getParametro(0, function(err, res) {
                if (err) {
                    return callback(err);
                }
                var parametros = res;
                fnSendMessage(mensaje2, parametros, playList, function(err, res) {
                    if (!err) {
                    	res2 = JSON.parse(res);
                        mensaje2.estado = "ENVIADO";
                        mensaje2.pushId = res2.id;
                        fnPutMensaje(mensaje2.mensajeId, mensaje2, function(err, res) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, res);
                        });
                    } else {
                        err2 = new Error("[MENSAJE NO ENVIADO] " + err.message);
                        // borra el mensaje porque no vale
                        fnDeleteMensaje(mensaje2.mensajeId, mensaje2, function(err, res) {
                            return callback(err2);
                        });
                    }
                });
            });
        })
    })
}


// Returns an array with userPushIds and playersIds
// dependig on parameters

var fnObtainPlayersIds = function(mensaje, callback) {
    var playList = [];
    var sql = "";
    var conn = conector.getConnectionPush();

    // if there aren't any parameters, return empty array
    // no users to send for
    if (!mensaje.usuarioPushId && !mensaje.ariagro && !mensaje.telefonia && !mensaje.tienda && !mensaje.gasolinera) {
        return callback(null, playList);
    }
    if (mensaje.usuarioPushId) {
        // if there's an user, we send to that user no matter 
        // what global sending parameters we have.
        sql = "SELECT usuarioPushId, playerId FROM usuariospush WHERE usuarioPushId = ?";
        sql = mysql.format(sql, mensaje.usuarioPushId);
        conn.query(sql, function(err, result) {
            conector.closeConnection(conn);
            if (err) {
                return callback(err, null);
            }
            playList = result;
            return callback(null, playList);
        });
    } else {
        // It depends on wich flag is active we build a diferent sql
        sql = "SELECT usuarioPushId, playerId FROM usuariospush WHERE NOT playerId IS NULL";
        if (mensaje.ariagro) sql += " AND NOT ariagroId IS NULL";
        if (mensaje.tienda) sql += " AND NOT tiendoId IS NULL";
        if (mensaje.telefonia) sql += " AND NOT telefoniaId IS NULL";
        if (mensaje.gasolinera) sql += " AND NOT gasolineraId IS NULL";
        conn.query(sql, function(err, result) {
            conector.closeConnection(conn);
            if (err) {
                return callback(err, null);
            }
            playList = result;
            return callback(null, playList);
        });
    }
}

var fnSendMessage = function(mensaje, parametros, playList, callback) {
    // obtain list of playersIds
    var include_player_ids = [];
    var contenido = "[" + mensaje.asunto + "] " + mensaje.texto;
    for (var i = 0; i < playList.length; i++) {
        include_player_ids.push(playList[i].playerId);
    };
    var data = {
        app_id: parametros.appId,
        include_player_ids: include_player_ids,
        headings: {
            en: parametros.tituloPush
        },
        data: {
            mensajeId: mensaje.mensajeId
        },
        contents: {
            en: contenido
        }
    };
    var request = require('request');

    var options = {
        url: 'https://onesignal.com/api/v1/notifications',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + parametros.restApi,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    request(options, function(error, response, body) {
        var res = null;
        if (body) {
            res = JSON.parse(body);
        }
        if (!error && response.statusCode == 200) {
            if (res.errors) {
                var err = new Error(res.errors[0]);
                return callback(err, null);
            }
            return callback(null, body);
        } else {
            if (res.errors) {
                var err = new Error(res.errors[0]);
                return callback(err, null);
            } else {
                return callback(error);
            }

        }
    });
};


var fnStoreMensaje = function(mensaje, playList, callback) {
    var mensaje2 = {
        mensajeId: mensaje.mensajeId,
        asunto: mensaje.asunto,
        texto: mensaje.texto,
        estado: 'PENDIENTE',
        fecha: new Date()
    }
    if (!comprobarMensaje(mensaje2)) {
        var err = new Error("El mensaje pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = conector.getConnectionPush();
    mensaje.mensajeId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO mensajes SET ?";
    sql = mysql.format(sql, mensaje2);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        mensaje2.mensajeId = result.insertId;
        fnStoreMensajeUsuarios(mensaje2, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, mensaje2);
        })
    });
}

var fnStoreMensajeUsuarios = function(mensaje, playList, callback) {
    // write records for all users implied when a message is sent
    var records = [];
    var record = [];
    for (var i = 0; i < playList.length; i++) {
        record = [];
        record.push(mensaje.mensajeId);
        record.push(playList[i].usuarioPushId);
        record.push('ENVIADO');
        records.push(record);
    }
    var conn = conector.getConnectionPush();
    sql = "INSERT INTO mensajes_usuariospush (mensajeId, usuarioPushId, estado) VALUES  ?";
    sql = mysql.format(sql, [records]);
    conn.query(sql, function(err, result) {
        conector.closeConnection(conn);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

var fnDeleteMensaje = function(id, mensaje, callback) {
    var connection = conector.getConnectionPush();
    sql = "DELETE from mensajes_usuariospush WHERE mensajeId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            conector.closeConnection(connection);
            return callback(err);
        }
        sql = "DELETE from mensajes WHERE mensajeId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function(err, result) {
            conector.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
};

var fnPutMensaje = function(id, mensaje, callback) {
    if (!comprobarMensaje(mensaje)) {
        var err = new Error("El mensaje pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    if (id != mensaje.mensajeId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = conector.getConnectionPush();
    sql = "UPDATE mensajes SET ? WHERE mensajeId = ?";
    sql = mysql.format(sql, [mensaje, mensaje.mensajeId]);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, mensaje);
    });
};
