// conector_mysql.js

var config = require('../../config/mysql_config.json');
var mysql = require('mysql');

module.exports.getConnectionUsuarios = function () {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: config.database_usuarios,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionAriagro = function () {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: config.database_ariagro,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionCampanya = function (campanya) {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: campanya,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTienda = function () {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: config.database_tienda,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTelefonia = function () {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: config.database_telefonia,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionGasolinera = function () {
    var connection = mysql.createConnection( {
        host: config.server,
        user: config.user,
        password: config.password,
        database: config.database_gasolinera,
        port: config.port
    });
    connection.connect(function (err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.closeConnection = function (connection) {
    connection.end(function(err){
        if (err) throw err;
    });
};