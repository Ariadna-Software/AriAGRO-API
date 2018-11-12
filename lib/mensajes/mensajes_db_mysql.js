// mensajes_db_mysql
// Manejo de la tabla mensajes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var conector = require('../comun/conector_mysql');
var http = require('http');
var async = require('async');
var parametrosDb = require('../parametros/parametros_db_mysql');
var cfg = require('../../config/config.json');
var fs = require("fs");
var csv = require("csv");
var myutil = require('../comun/myutil');
var XLSX = require('xlsx');
var nodemailer = require('nodemailer');
var config2 = require("../../config/config_stireport.json");
var Stimulsoft = require('stimulsoft-reports-js');
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
    // 1- verificamos que el correo contiene asunto y texto
    if (!correo || !correo.asunto || !correo.texto){
        var err = new Error('El correo es incorrecto');
        return callback(err);
    }
    // 2- Montamos el transporte del correo basado en la
    // configuración.
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

    // if there's an user, we send to that user no matter 
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
    var fileName = cfg.ficheros + fichero;
    switch (ext) {
        case 'csv':
            // read cvs file
            fs.readFile(fileName, 'utf8', function(err, data) {
                if (err) {
                    return callback(err, null);
                }
                csv.parse(data, { "delimiter": ";" }, function(err, data) {
                    if (err) {
                        return callback(err, null);
                    }
                    var codes = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i][0];
                        if (myutil.isNumber(item)) {
                            codes.push(item);
                        }
                    }
                    var inSQL = codes.toString();
                    var playList = [];
                    var sql = "";
                    var conn = conector.getConnectionPush();

                    sql = "SELECT u.usuarioPushId, u.playerId";
                    sql += " FROM usuariospush AS u";
                    sql += " WHERE u.comunId IN (?)";
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
            var i = 0
            while (!cellEmpty) {
                // Only first column
                i++;
                var cell = sheet['A' + i];
                if (!cell) {
                    cellEmpty = true;
                } else {
                    var cellValue = cell.v;
                    if (myutil.isNumber(cellValue)) {
                        codes.push(cellValue);
                    }
                }
            }
            var inSQL = codes.toString();
            var playList = [];
            var sql = "";
            var conn = conector.getConnectionPush();

            sql = "SELECT u.usuarioPushId, u.playerId";
            sql += " FROM usuariospush AS u";
            sql += " WHERE u.comunId IN (?)";
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
            break;
        default:
            // by defalut empty array returned
            callback(null, []);
            break;
    }
}

//Envio de correos clasificacion

module.exports.postPrepararCorreos = function (numalbar, campanya, informe, done) {
    crearJson(numalbar, campanya, (err, obj) => {
        if (err) return done(err);
        if (obj) {
            crearPdfsClasif(numalbar, informe, obj, (err, result) => {
                if (err) return done(err);
                done(null, result);
            });
        }
    });
}

module.exports.postEnviarCorreos = function (numalbar, email, ruta , coop, done) {
    // TODO: Hay que montar los correos propiamente dichos
    crearCorreosAEnviar(numalbar, email, ruta, coop, (err, data) => {
        if (err) return done(err);
        var msg = data;
        done(null, msg);
    })
}

var crearJson = function(numalbar, campanya, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var facturas = null;
    var obj = 
        {
            cabecera_agro: "",
            entrada_agro: "",
            clasific_agro: "",
            incidencia_agro: ""
        }
   
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.cifempre AS cifempre, ";
    sql += " c.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, c.codcampo, v.nomvarie, ";
    sql += " nomparti, poligono, parcela, recintos, COALESCE(k.kilos,0) AS kilostot, h.numalbar, DATE_FORMAT(h.fecalbar,'%Y-%m-%d') AS fecalbar, numcajon, kilosnet";
    sql += " FROM rcampos AS c";
    sql += " LEFT JOIN variedades AS v ON v.codvarie = c.codvarie";
    sql += " LEFT JOIN rpartida AS p ON p.codparti = c.codparti";
    sql += " LEFT JOIN (SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta GROUP BY codcampo) AS k ON k.codcampo = c.codcampo";
    sql += " LEFT JOIN rhisfruta AS h ON h.codcampo = c.codcampo";
    sql += " LEFT JOIN rsocios AS so ON c.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE c.fecbajas IS NULL AND h.numalbar = " + numalbar;
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        obj.cabecera_agro = cab;
        
        var con2 = conector.getConnectionCampanya(campanya);
        var sql2 = "SELECT ent.numalbar, ent.tiporecol,ent.numnotac, DATE_FORMAT(ent.fechaent,'%Y-%m-%d') AS fechaent, ent.kilosnet, ent.numcajon, ri.tipoentr";
        sql2 += " FROM rhisfruta_entradas AS ent"; 
        sql2 += " LEFT JOIN rhisfruta AS ri ON ri.numalbar = ent.numalbar";
        sql2 += " WHERE ent.numalbar = " + numalbar;
        con2.query(sql2, function (err, entrada) {
            con2.end();
            if (err) return callback(err, null);
            obj.entrada_agro = entrada;
            var con3 = conector.getConnectionCampanya(campanya);
            var sql3 = "SELECT rhisfruta_clasif.numalbar, rhisfruta_clasif.codcalid, rcalidad.nomcalid AS calidad, rhisfruta_clasif.kilosnet AS kilos";
            sql3 += " FROM rhisfruta_clasif";
            sql3 += " INNER JOIN rcalidad ON rhisfruta_clasif.codvarie = rcalidad.codvarie AND rhisfruta_clasif.codcalid = rcalidad.codcalid";
            sql3 += " WHERE rhisfruta_clasif.kilosnet > 0 AND  rhisfruta_clasif.numalbar = " +numalbar
            con3.query(sql3, function (err, clasif) {
                con3.end();
                if (err) return callback(err, null);
                obj.clasific_agro = clasif;
                var con4 = conector.getConnectionCampanya(campanya);
                var sql4 = "SELECT inc.*, rin.nomincid FROM rhisfruta_incidencia AS inc";
                sql4 += " LEFT JOIN rincidencia AS rin ON rin.codincid = inc.codincid";
                sql4 += " WHERE inc.numalbar = " + numalbar;
                con4.query(sql4, function (err, incidencia) {
                    con4.end();
                    if (err) return callback(err, null);
                    obj.incidencia_agro = incidencia;
                    
                    return callback(null, obj);
                });
            });
        });
    });
}

//metodo para reports con diccionario MMySql
/*var crearPdfsClasif = function (numalbar, campanya, informe, callback) {
    var con = conector.getConnectionAriagro();
    var facturas = null;
   
    sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.cifempre AS cifempre, ";
    sql += " c.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, c.codcampo, v.nomvarie, ";
    sql += " nomparti, poligono, parcela, recintos, COALESCE(k.kilos,0) AS kilostot, h.numalbar, DATE_FORMAT(h.fecalbar,'%d/%m/%Y') AS fecalbar, numcajon, kilosnet";
    sql += " FROM rcampos AS c";
    sql += " LEFT JOIN variedades AS v ON v.codvarie = c.codvarie";
    sql += " LEFT JOIN rpartida AS p ON p.codparti = c.codparti";
    sql += " LEFT JOIN (SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta GROUP BY codcampo) AS k ON k.codcampo = c.codcampo";
    sql += " LEFT JOIN rhisfruta AS h ON h.codcampo = c.codcampo";
    sql += " LEFT JOIN rsocios AS so ON c.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1"
   
    Stimulsoft.StiOptions.WebServer.url = "http://" + config2.apiHost + ":" + config2.stiPort;
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
        "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
        "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
        "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
        "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
        "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
        "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    con.query(sql, function (err, result) {
        con.end();
        if (err) return callback(err, null);
        clasif = result;
       
       
            var file = config2.reports_dir + "\\" + informe;
            var report = new Stimulsoft.Report.StiReport();
            
            
            report.loadFile(file);
           
            var connectionString = "Server=" + config2.report.host + ";";
            connectionString += "Database=" + campanya + ";"
            connectionString += "UserId=" + config2.report.user + ";"
            connectionString += "Pwd=" + config2.report.password + ";";
            report.dictionary.databases.list[0].connectionString = connectionString;
            var pos = 0;
            var pos2 = 0;
            for (var i = 0; i < report.dataSources.items.length; i++) {
                var str = report.dataSources.items[i].sqlCommand;
                if (str.indexOf("h.numalbar") > -1) pos = i;
                if (str.indexOf("rin.nomincid") > -1) pos2 = i;
            }
            var sql = report.dataSources.items[pos].sqlCommand;
            report.dataSources.items[pos].sqlCommand = sql + " WHERE c.fecbajas IS NULL AND h.numalbar = " + numalbar;

            var sql2 = report.dataSources.items[pos2].sqlCommand;
            report.dataSources.items[pos2].sqlCommand = sql2 + " WHERE inc.numalbar = " + numalbar;
           
           
            report.renderAsync(function () {
                // Creating export settings
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                // Creating export service
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                // Creating MemoryStream
                var stream = new Stimulsoft.System.IO.MemoryStream();
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                var stream = new Stimulsoft.System.IO.MemoryStream();

                service.exportTo(report, stream, settings);

                var data = stream.toArray();


                var buffer = new Buffer(data, "utf-8");



               
                fs.writeFile(config2.clasif_dir + "\\" + numalbar + ".pdf", buffer, function(err){
                    if(err) return callback(err, null);
                });
                var coop = result;
                var ruta = config2.clasif_dir + "\\" + numalbar + ".pdf";
                callback(null, ruta);
              
            });
    });
}*/

var crearPdfsClasif = function (numalbar, informe, obj, callback) {
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
        "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
        "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
        "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
        "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
        "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
        "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
        var file = config2.reports_dir + "\\" + informe;
        var report = new Stimulsoft.Report.StiReport();
            
            
        report.loadFile(file);

        
        var dataSet = new Stimulsoft.System.Data.DataSet("clasif");
        dataSet.readJson(obj);
        
         // Remove all connections from the report template
         report.dictionary.databases.clear();
    
         //
        report.regData(dataSet.dataSetName, "", dataSet);
        report.dictionary.synchronize();

        report.renderAsync(function () {
            // Creating export settings
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            // Creating export service
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            // Creating MemoryStream
            var stream = new Stimulsoft.System.IO.MemoryStream();
            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
            var service = new Stimulsoft.Report.Export.StiPdfExportService();
            var stream = new Stimulsoft.System.IO.MemoryStream();

            service.exportTo(report, stream, settings);

            var data = stream.toArray();


            var buffer = new Buffer(data, "utf-8");

            fs.writeFile(config2.clasif_dir + "\\" + numalbar + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });
            var ruta = config2.clasif_dir + "\\" + numalbar + ".pdf";
            callback(null, ruta);
        });
}




// crearCorreosAEnviar
var crearCorreosAEnviar = (numalbar, email, ruta, coop, callback) => {
    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
    correo.asunto = '['+coop+'] Clasificación'
    correo.texto = "Estimado socio/socia esta es la clasificación solicitada del albaran "+ numalbar +". \n Reciba un cordial saludo";

    // 2- Montamos el transporte del correo basado en la
    // configuración.
    var transporter = nodemailer.createTransport(cfg.smtpConfig);
    var emisor = cfg.smtpConfig.auth.user;
    
    var mailOptions = {
        from: emisor,
        to: email,
        subject:  correo.asunto,
        text: correo.texto
    };

    var  attach = {
        filename: ruta.replace(/^.*[\\\/]/, ''),
        path: ruta
    };
    mailOptions.attachments = attach;


    // 3- Enviar el correo propiamente dicho
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            return callback(err);
        }
        //borramos el pdf que hemos enviado
        fs.unlink(config2.clasif_dir + "\\" + numalbar + ".pdf", (err) => {
            return callback(err);
            console.log('archivo borrado con exito');
          });
        callback(null, true);
    });

}
