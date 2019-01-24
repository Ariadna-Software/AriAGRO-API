// conector_mysql.js
var mysql = require('mysql');
//var config2 = require('../../config/mysql_config.json');




module.exports.getConnectionGeneral = function(db) {
    var connection = mysql.createConnection({
        host: process.env.SERVER,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: db,
        port: process.env.PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionUsuarios = function() {
    var connection = mysql.createConnection({
        host: process.env.USUARIOS_SERVER,
        user: process.env.USUARIOS_USER,
        password: process.env.USUARIOS_PASSWORD,
        database: process.env.USUARIOS_DATABASE,
        port: process.env.USUARIOS_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionAriagro = function() {
    var connection = mysql.createConnection({
        host: process.env.ARIAGROSERVER,
        user: process.env.ARIAGROUSER,
        password: process.env.ARIAGROPASSWORD,
        database: process.env.ARIAGRODATABASE,
        port: process.env.ARIAGROPORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionCampanya = function(campanya) {
    var connection = mysql.createConnection({
        host: process.env.ARIAGROSERVER,
        user: process.env.ARIAGROUSER,
        password: process.env.ARIAGROPASSWORD,
        database: campanya,
        port: process.env.ARIAGROPORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionTienda = function() {
    var connection = mysql.createConnection({
        host: process.env.TIENDA_SERVER,
        user: process.env.TIENDA_USER,
        password: process.env.TIENDA_PASSWORD,
        database: process.env.TIENDA_DATABASE,
        port: process.env.TIENDA_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionTratamientos = function(db) {
    if (!db) {
        db = process.env.TRATAMIENTOS_DATABASE;
    }
    var connection = mysql.createConnection({
        host: process.env.TRATAMIENTOS_SERVER,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: db,
        port: process.env.TRATAMIENTOS_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};



module.exports.getConnectionTelefonia = function() {
    var connection = mysql.createConnection({
        host: process.env.TELEFONIA_SERVER,
        user: process.env.TELEFONIA_USER,
        password: process.env.TELEFONIA_PASSWORD,
        database: process.env.TELEFONIA_DATABASE,
        port: process.env.TELEFONIA_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionGasolinera = function() {
    var connection = mysql.createConnection({
        host: process.env.GASOLINERA_SERVER,
        user: process.env.GASOLINERA_USER,
        password: process.env.GASOLINERA_PASSWORD,
        database: process.env.GASOLINERA_DATABASE,
        port: process.env.GASOLINERA_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};


module.exports.getConnectionGesSocial = function() {
    var connection = mysql.createConnection({
        host: process.env.GESSOCIAL_SERVER,
        user: process.env.GESSOCIAL_USER,
        password: process.env.GESSOCIAL_PASSWORD,
        database: process.env.GESSOCIAL_DATABASE,
        port: process.env.GESSOCIAL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
        return null;
    });
    return connection;
};

module.exports.getConnectionPush = function() {
    var connection = mysql.createConnection({
        host: process.env.PUSH_SERVER,
        user: process.env.PUSH_USER,
        password: process.env.PUSH_PASSWORD,
        database: process.env.PUSH_DATABASE,
        port: process.env.PUSH_PORT
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
    if (!process.env.ARIAGRODATABASE || process.env.ARIAGRODATABASE == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseGasolinera = function() {
    if (!process.env.GASOLINERA_DATABASE || process.env.GASOLINERA_DATABASE == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTelefonia = function() {
    if (!process.env.TELEFONIA_DATABASE || process.env.TELEFONIA_DATABASE == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTienda = function() {
    if (!process.env.TIENDA_DATABASE || process.env.TIENDA_DATABASE == "") {
        return false;
    } else {
        return true;
    }
}

module.exports.controlDatabaseTratamientos = function() {
    if (!process.env.TRATAMIENTOS_DATABASE || process.env.TRATAMIENTOS_DATABASE == "") {
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

