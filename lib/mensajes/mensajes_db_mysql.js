// mensajes_db_mysql
// Manejo de la tabla mensajes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var conector = require('../comun/conector_mysql');
var parametrosDb = require('../parametros/parametros_db_mysql');
//var cfg = require('../../config/config.json');
var fs = require("fs");
var csv = require("csv");
var myutil = require('../comun/myutil');
var XLSX = require('xlsx');
var nodemailer = require('nodemailer');
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

function recuperaConfig() {
    var cfg = {
        apiPort: process.env.API_PORT,
        apiHost: process.env.API_HOST,
        ficheros: process.env.FICHEROS,
        reports_dir: process.env.REPORTS_DIR,
        clasif_dir: process.env.CLASIF_DIR,
        json_dir: process.env.JSON_DIR,
        smtpConfig: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        },
        destinatario: process.env.EMAIL_DESTINATARIO
    }
    return cfg;
}


// getMensajesUsuario
// lee los mensajes relacionados con un determinado usuario
module.exports.getMensajesUsuario = function(usuarioPushId, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    sql = "SELECT m.mensajeId, m.asunto, m.texto, m.fecha, mu.estado, mu.fecha as fechalec";
    sql += " FROM mensajes_usuariospush AS mu";
    sql += " LEFT JOIN mensajes AS m ON m.mensajeId = mu.mensajeId";
    sql += " WHERE mu.usuarioPushId = ?";
    sql += " AND m.estado = 'ENVIADO'";
    sql += " ORDER by m.fecha DESC";
    sql = mysql.format(sql, usuarioPushId);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });

}

// getUsuariosMensaje
// lee los usuarios relacionados con un determinado mensaje
module.exports.getUsuariosMensaje = function(mensajeId, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    sql = "SELECT m.asunto, u.nombre, u.telefono1, u.telefono2, u.email, mu.estado, mu.fecha AS fechalec";
    sql += " FROM mensajes AS m";
    sql += " LEFT JOIN mensajes_usuariospush AS mu ON (mu.mensajeId = m.mensajeId)";
    sql += " LEFT JOIN usuariospush AS u ON (u.usuarioPushId = mu.usuarioPushId)";
    sql += " WHERE m.mensajeId = ?";
    sql += " ORDER BY u.nombre";
    sql = mysql.format(sql, mensajeId);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });

}

// putMensajesUsuario
module.exports.putMensajesUsuario = function(usuarioPushId, mensajeId, fecha, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    sql = "UPDATE mensajes_usuariospush";
    sql += " SET estado = 'LEIDO', fecha = ?";
    sql += " WHERE mensajeId = ? AND usuarioPushId = ?";
    sql = mysql.format(sql, [fecha, mensajeId, usuarioPushId]);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, null);
    });

}


// lee todos los registros de la tabla mensajes y
// los devuelve como una lista de objetos
module.exports.getMensajes = function(usuarioPushId, callback) {
    var connection = conector.getConnectionPush();
    var mensajes = null;
    var sql = "SELECT mens.*, ad.nombre AS responsable FROM mensajes AS mens";
    sql += " LEFT JOIN administradores AS ad ON ad.administradorId = mens.administradorId";
    sql += " ORDER BY fecha DESC";
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
    var sql = "SELECT mens.*, ad.nombre AS responsable FROM mensajes AS mens";
    sql += " LEFT JOIN administradores AS ad ON ad.administradorId = mens.administradorId";
    sql += " ORDER BY fecha DESC";
    if (nombre !== "*") {
        sql = "SELECT mens.*, ad.nombre AS responsable FROM mensajes AS mens";
        sql += " LEFT JOIN administradores AS ad ON ad.administradorId = mens.administradorId";
        sql += " WHERE asunto LIKE ?";
        sql += " ORDER BY fecha DESC";
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
    var sql = "SELECT mens.*, ad.nombre AS responsable FROM mensajes AS mens";
    sql += " LEFT JOIN administradores AS ad ON ad.administradorId = mens.administradorId";
    sql += " WHERE mens.mensajeId = ?";
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
module.exports.getConfigCorreo = function(callback) {
    var cfg = recuperaConfig();
    callback(null, cfg)
}


// postMensaje
// crear en la base de datos el mensaje pasado
module.exports.postMensaje = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIds(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        if (playList.length == 0){
            var err = new Error('No se ha escogido ningún destinatario');
            return callback(err);
        }
        fnStoreMensaje2(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, res);
        })
    });
}

// postCorreo
// Envia un mensaje de correo al destinatario en config
module.exports.postCorreo = function(correo, callback){
    var cfg = recuperaConfig()
   
    
    // 1- verificamos que el correo contiene asunto y texto
    if (!correo || !correo.asunto || !correo.texto){
        var err = new Error('El correo es incorrecto');
        return callback(err);
    }
    comprobarIban(correo.texto, function(data,err) {
        if(err) return callback(err);
            // 2- Montamos el transporte del correo basado en la
             // configuración.
             correo.texto = data;
            var transporter = nodemailer.createTransport(cfg.smtpConfig);
            var emisor = cfg.destinatario;
             if (correo.emisor){
                emisor = correo.emisor;
            }
            var mailOptions = {
                from: emisor,
                to: cfg.destinatario,
                subject: '[ARIAGROAPP] ' + correo.asunto,
                text: correo.texto
            };
                // 3- Enviar el correo propiamente dicho
                transporter.sendMail(mailOptions, function(err, info){
                    if (err){
                        err.message = "Opción no disponible, consulte con su coperativa"
                        return callback(err);
                    }
                    callback(null, 'Correo enviado');
                });
    });
}

var comprobarIban = function(texto, callback) {
    var n;
    var posicion;
    var subcadena;

    posicion = texto.indexOf("después de la modificación");
    subcadena = texto.substr(posicion);

    posicion = subcadena.indexOf("iban");
    subcadena = subcadena.substr(posicion);
    n = subcadena.indexOf("*");
    if(n != -1) {
        var err2 = new Error('El correo es incorrecto, se han incluido * en el iban');
        return callback(null, err2);
    }else {
        return callback(texto, null);
    }
}

// putMensaje
// Modifica el mensaje según los datos del objeto pasao
module.exports.putMensaje = fnPutMensaje;

// deleteMensaje
// Elimina el mensaje con el id pasado
module.exports.deleteMensaje = function(id, mensaje, callback) {
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

module.exports.postSendMensajeNew = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIdsFromMensaje(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        parametrosDb.getParametro(0, function(err, res) {
            if (err) {
                return callback(err);
            }
            var parametros = res;
            fnSendMessage(mensaje, parametros, playList, function(err, res) {
                if (!err) {
                    fnPutMensajeNew(mensaje.mensajeId, mensaje.administradorId,function(err, res) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, res);
                    });
                } else {
                    err2 = new Error("[MENSAJE NO ENVIADO] " + err.message);
                    // borra el mensaje porque no vale
                    return callback(err2);
                }
            });
        });

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
    if ((!mensaje.usuarios || mensaje.usuarios.length == 0) && !mensaje.ariagro && !mensaje.telefonia && !mensaje.tienda && !mensaje.gasolinera && !mensaje.fichero && !mensaje.soloMensajes && !mensaje.esTrabajador) {
        return callback(null, playList);
    }
    // tratamiento del mensaje cuando es un fichero
    if (mensaje.fichero) {
        fnObtainPlayersIdsFromFichero(mensaje.fichero, callback);
    } else {
        if (mensaje.usuarios && mensaje.usuarios.length > 0) {
            var inSQL = mensaje.usuarios.toString();
            sql = "SELECT u.usuarioPushId, u.playerId";
            sql += " FROM usuariospush AS u";
            sql += " WHERE u.usuarioPushId IN (?)";
            sql += " AND NOT u.playerId IS NULL"
            sql = mysql.format(sql, inSQL);
            sql = sql.replace(/'/g, "");
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
            if (mensaje.soloMensajes) sql += " AND soloMensajes = 1";
            if (mensaje.esTrabajador) sql += " AND esTrabajador = 1";
            if (mensaje.ariagro) sql += " AND NOT ariagroId IS NULL";
            if (mensaje.tienda) sql += " AND NOT tiendaId IS NULL";
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
}

var fnObtainPlayersIdsFromMensaje = function(mensaje, callback) {
    var playList = [];
    var sql = "";
    var conn = conector.getConnectionPush();

    // if there's an USER, we send to that USER no matter 
    // what global sending parameters we have.
    sql = "SELECT u.usuarioPushId, u.playerId";
    sql += " FROM mensajes AS m";
    sql += " LEFT JOIN mensajes_usuariospush AS mu ON mu.mensajeId = m.mensajeId";
    sql += " LEFT JOIN usuariospush AS u ON u.usuarioPushId = mu.usuarioPushId";
    sql += " WHERE m.mensajeId = ?";
    sql = mysql.format(sql, mensaje.mensajeId);
    conn.query(sql, function(err, result) {
        conector.closeConnection(conn);
        if (err) {
            return callback(err, null);
        }
        playList = result;
        return callback(null, playList);
    });
}

var fnSendMessage = function(mensaje, parametros, playList, callback) {
    // obtain list of playersIds
    var include_player_ids = [];
    var contenido = "[" + parametros.tituloPush + "] " + mensaje.asunto;
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
            console.log("RES ONESIGNAL: ", res);
        }
        if (!error && response.statusCode == 200) {
            return callback(null, body);
        } else {
            return callback(error);
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

var fnStoreMensaje2 = function(mensaje, playList, callback) {
    var mensaje2 = {
        mensajeId: mensaje.mensajeId,
        asunto: mensaje.asunto,
        texto: mensaje.texto,
        estado: 'PENDIENTE',
        fecha: new Date(),
        administradorId: mensaje.administradorId
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
        fnStoreMensajeUsuarios2(mensaje2, playList, function(err, res) {
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


var fnStoreMensajeUsuarios2 = function(mensaje, playList, callback) {
    // write records for all users implied when a message is sent
    var records = [];
    var record = [];
    for (var i = 0; i < playList.length; i++) {
        record = [];
        record.push(mensaje.mensajeId);
        record.push(playList[i].usuarioPushId);
        record.push('PENDIENTE');
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


var fnPutMensajeNew = function(id, administradorId,callback) {
    var connection = conector.getConnectionPush();
    sql = "UPDATE mensajes AS m, mensajes_usuariospush AS mu";
    sql += " SET m.estado = 'ENVIADO', mu.estado = 'ENVIADO', m.administradorId = ?";
    sql += " WHERE m.mensajeId = ? AND mu.mensajeId = ?;"
    sql = mysql.format(sql, [administradorId, id, id]);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, null);
    });
};

var fnObtainPlayersIdsFromFichero = function(fichero, callback) {
    // Whats is the files's extension?
    var ext = fichero.split('.').pop();
    var fileName = process.env.FICHEROS + fichero;
    switch (ext) {
        case 'csv':
            // read cvs file
            fs.readFile(fileName, 'utf8', function(err, data) {
                if (err) {
                    return callback(err, null);
                }
                csv.parse(data, { "delimiter": "," }, function(err, data) {
                    if (err) {
                        return callback(err, null);
                    }
                    var codes = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i][0];
                        if (myutil.isNumber(item)) {
                            item = parseInt(item);
                            codes.push(item);
                        } else {
                            codes.push(item);
                        }    
                    }
                    //var inSQL = codes.toString();
                    var playList = [];
                    var sql = "";
                    var conn = conector.getConnectionPush();
                    var inSQL = "";
                    var cont;

                    for(var j = 0; j < codes.length; j++) {
                        cont = codes.length - 1
                        inSQL += '"'+ codes[j] +'"' ;
                        if (j == cont) break;
                        inSQL += ",";
                    }
                    sql = "SELECT u.usuarioPushId, u.playerId";
                    sql += " FROM usuariospush AS u";
                    sql += " WHERE u.login IN ("+inSQL+")";
                    sql += " AND NOT u.playerId IS NULL"
                    //sql = mysql.format(sql, inSQL);
                    sql = sql.replace(/'/g, "");
                    conn.query(sql, function(err, result) {
                        conector.closeConnection(conn);
                        if (err) {
                            return callback(err, null);
                        }
                        playList = result;
                        return callback(null, playList);
                    });
                })
            });
            break;
        case 'xlsx':
        case 'xls':
            var book = XLSX.readFile(fileName);
            var sheet_name = book.SheetNames[0];
            var sheet = book.Sheets[sheet_name];
            var cellEmpty = false;
            var codes = [];
            var inSQL = "";
            var i = 0
            var cont;
            while (!cellEmpty) {
                // Only first column
                i++;
                var cell = sheet['A' + i];
                if (!cell) {
                    cellEmpty = true;
                } else {
                    var cellValue = cell.v;
                    if (myutil.isNumber(cellValue)) {
                        cellValue = parseInt(cellValue);
                        codes.push(cellValue);
                    } else {
                        codes.push(cellValue);
                    }    
                }
            }
            for(var j = 0; j < codes.length; j++) {
                cont = codes.length - 1
                inSQL += '"'+ codes[j] +'"' ;
                if (j == cont) break;
                inSQL += ",";
            }
            //var inSQL = codes.toString();
            var playList = [];
            var sql = "";
            var conn = conector.getConnectionPush();

            sql = "SELECT u.usuarioPushId, u.playerId";
            sql += " FROM usuariospush AS u";
            sql += " WHERE u.login IN ("+inSQL+")";
            sql += " AND NOT u.playerId IS NULL"
            //sql = mysql.format(sql, inSQL);
            sql = sql.replace(/'/g, "");
            conn.query(sql, function(err, result) {
                conector.closeConnection(conn);
                if (err) {
                    return callback(err, null);
                }
                playList = result;
                return callback(null, playList);
            });
            break;
        default:
            // by defalut empty array returned
            callback(null, []);
            break;
    }
}





