// conector_mysql.js
var mysql = require('mysql');
//var config2 = require('../../config/mysql_config.json');


//importacion de configuración .env
var config = require('dotenv');
config.config();


module.exports.getConnectionGeneral = function(db) {
    var connection = mysql.createConnection({
        host: process.env.server,
        user: process.env.user,
        password: process.env.password,
        database: db,
        port: process.env.port
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionUsuarios = function() {
    var connection = mysql.createConnection({
        host: process.env.usuariosserver,
        user: process.env.usuariosuser,
        password: process.env.usuariospassword,
        database: process.env.usuariosdatabase,
        port: process.env.usuariosport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionAriagro = function() {
    var connection = mysql.createConnection({
        host: process.env.ariagroserver,
        user: process.env.ariagrouser,
        password: process.env.ariagropassword,
        database: process.env.ariagrodatabase,
        port: process.env.ariagroport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionCampanya = function(campanya) {
    var connection = mysql.createConnection({
        host: process.env.ariagroserver,
        user: process.env.ariagrouser,
        password: process.env.ariagropassword,
        database: campanya,
        port: process.env.ariagroport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTienda = function() {
    var connection = mysql.createConnection({
        host: process.env.tiendaserver,
        user: process.env.tiendauser,
        password: process.env.tiendapassword,
        database: process.env.tiendadatabase,
        port: process.env.tiendaport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionTratamientos = function(db) {
    if (!db) {
        db = process.env.tratamientosdatabase;
    }
    var connection = mysql.createConnection({
        host: process.env.tratamientosserver,
        user: process.env.user,
        password: process.env.password,
        database: db,
        port: process.env.tratamientosport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};



module.exports.getConnectionTelefonia = function() {
    var connection = mysql.createConnection({
        host: process.env.telefoniaserver,
        user: process.env.telefoniauser,
        password: process.env.telefoniapassword,
        database: process.env.telefoniadatabase,
        port: process.env.telefoniaport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionGasolinera = function() {
    var connection = mysql.createConnection({
        host: process.env.gasolineraserver,
        user: process.env.gasolinerauser,
        password: process.env.gasolinerapassword,
        database: process.env.gasolineradatabase,
        port: process.env.gasolineraport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionGesSocial = function() {
    var connection = mysql.createConnection({
        host: process.env.gessocialserver,
        user: process.env.gessocialuser,
        password: process.env.gessocialpassword,
        database: process.env.gessocialdatabase,
        port: process.env.gessocialport
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionPush = function() {
    var connection = mysql.createConnection({
        host: process.env.pushserver,
        user: process.env.pushuser,
        password: process.env.pushpassword,
        database: process.env.pushdatabase,
        port: process.env.pushport
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
    if (!process.env.ariagrodatabase || process.env.ariagrodatabase == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseGasolinera = function() {
    if (!process.env.gasolineradatabase || process.env.gasolineradatabase == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTelefonia = function() {
    if (!process.env.telefoniadatabase || process.env.telefoniadatabase == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTienda = function() {
    if (!process.env.tiendadatabase || process.env.tiendadatabase == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTratamientos = function() {
    if (!process.env.tratamientosdatabase || process.env.tratamientosdatabase == "") {
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

