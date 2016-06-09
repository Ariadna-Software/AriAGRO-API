// conector_mysql.js
var mysql = require('mysql');
var cfg2 = require('../../config/mysql_config.json');


module.exports.getConnectionGeneral = function(db) {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: db,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionUsuarios = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_usuarios,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionAriagro = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_ariagro,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionCampanya = function(campanya) {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: campanya,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTienda = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_tienda,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionTratamientos = function(db) {
    if (!db){
        db = cfg2.database_tratamientos;
    }
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: db,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};



module.exports.getConnectionTelefonia = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_telefonia,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionGasolinera = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_gasolinera,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionGesSocial = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_gessocial,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionPush = function() {
    var connection = mysql.createConnection({
        host: cfg2.server,
        user: cfg2.user,
        password: cfg2.password,
        database: cfg2.database_push,
        port: cfg2.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.closeConnection = function(connection) {
    connection.end(function(err) {
        if (err) throw err;
    });
};
