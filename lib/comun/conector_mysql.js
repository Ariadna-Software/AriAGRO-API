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
        host: cfg2.usuarios.server,
        user: cfg2.usuarios.user,
        password: cfg2.usuarios.password,
        database: cfg2.usuarios.database,
        port: cfg2.usuarios.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionAriagro = function() {
    var connection = mysql.createConnection({
        host: cfg2.ariagro.server,
        user: cfg2.ariagro.user,
        password: cfg2.ariagro.password,
        database: cfg2.ariagro.database,
        port: cfg2.ariagro.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionCampanya = function(campanya) {
    var connection = mysql.createConnection({
        host: cfg2.ariagro.server,
        user: cfg2.ariagro.user,
        password: cfg2.ariagro.password,
        database: campanya,
        port: cfg2.ariagro.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTienda = function() {
    var connection = mysql.createConnection({
        host: cfg2.tienda.server,
        user: cfg2.tienda.user,
        password: cfg2.tienda.password,
        database: cfg2.tienda.database,
        port: cfg2.tienda.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionTratamientos = function(db) {
    if (!db) {
        db = cfg2.tratamientos.database;
    }
    var connection = mysql.createConnection({
        host: cfg2.tratamientos.server,
        user: cfg2.user,
        password: cfg2.password,
        database: db,
        port: cfg2.tratamientos.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};



module.exports.getConnectionTelefonia = function() {
    var connection = mysql.createConnection({
        host: cfg2.telefonia.server,
        user: cfg2.telefonia.user,
        password: cfg2.telefonia.password,
        database: cfg2.telefonia.database,
        port: cfg2.telefonia.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionGasolinera = function() {
    var connection = mysql.createConnection({
        host: cfg2.gasolinera.server,
        user: cfg2.gasolinera.user,
        password: cfg2.gasolinera.password,
        database: cfg2.gasolinera.database,
        port: cfg2.gasolinera.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionGesSocial = function() {
    var connection = mysql.createConnection({
        host: cfg2.gessocial.server,
        user: cfg2.gessocial.user,
        password: cfg2.gessocial.password,
        database: cfg2.gessocial.database,
        port: cfg2.gessocial.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionPush = function() {
    var connection = mysql.createConnection({
        host: cfg2.push.server,
        user: cfg2.push.user,
        password: cfg2.push.password,
        database: cfg2.push.database,
        port: cfg2.push.port
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

module.exports.controlDatabaseAriagro = function() {
    if (!cfg2.ariagro || !cfg2.ariagro.database || cfg2.ariagro.database == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseGasolinera = function() {
    if (!cfg2.gasolinera || !cfg2.gasolinera.database || cfg2.gasolinera.database == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTelefonia = function() {
    if (!cfg2.telefonia || !cfg2.telefonia.database || cfg2.telefonia.database == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTienda = function() {
    if (!cfg2.tienda || !cfg2.tienda.database || cfg2.tienda.database == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTratamientos = function() {
    if (!cfg2.tratamientos || !cfg2.tratamientos.database || cfg2.tratamientos.database == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.sqlInString = function(v) {
    var sl = "";
    for (var i = 0; i < v.length; i++) {
        sl += "'" + v[i] + "',";
    }
    if (v.length > 0){
        // eliminar la última coma
        sl = sl.substring(0, sl.length-1);
    }
    return sl;
}
