//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var fs = require("fs");
var config2 = require("../../config/config_stireport.json");


// [export] getLogin
// 
module.exports.getAnticiposLiquidacionesSocio = function(codsocio, campanya, callback) {
    if (!conector.controlDatabaseAriagro()){
        return callback(null, []);
    }
    var usuario = null;
    var sql = "SELECT";
    sql += " f.codtipom, t.nomtipom,";
    sql += " t.letraser, f.numfactu, CONCAT(t.letraser, '-', f.numfactu) AS factura,";
    sql += " f.fecfactu, f.baseimpo, f.imporiva, f.impreten, f.totalfac,";
    sql += " v.nomvarie,";
    sql += " l.kilosnet, l.imporvar";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rfactsoc_variedad AS l ON l.codtipom = f.codtipom AND l.numfactu = f.numfactu AND l.fecfactu = f.fecfactu";
    sql += " LEFT JOIN variedades AS v ON v.codvarie = l.codvarie";
    sql += " WHERE f.codsocio = ?";
    sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu";
    sql = mysql.format(sql, codsocio);
    var connection = conector.getConnectionCampanya(campanya);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, fnFacturasFromDbToJson(result));
    });

};

var fnFacturasFromDbToJson = function(facturas) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var numfactuAnt = 0;
    var codtipomAnt = 0;
    for (var i = 0; i < facturas.length; i++) {
        var f = facturas[i];
        if (codtipomAnt != f.codtipom || numfactuAnt != f.numfactu) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                codtipom: f.codtipom,
                nomtipom: f.nomtipom,
                letraser: f.letraser,
                numfactu: f.numfactu,
                factura: f.letraser + "-" + f.numfactu,
                fecfactu: f.fecfactu,
                baseimpo: f.baseimpo,
                imporiva: f.imporiva,
                impreten: f.impreten,
                totalfac: f.totalfac,
                lineas: []
            };
            codtipomAnt = f.codtipom;
            numfactuAnt = f.numfactu;
        }
        // siempre se procesa una linea
        if (f.nomvarie) {
            linJs = {
                nomvarie: f.nomvarie,
                kilosnet: f.kilosnet,
                imporvar: f.imporvar
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}

//Envio de correos anticipos-liquidaciones

module.exports.postPrepararCorreos = function (numfactu, campanya, informe, codtipom, done) {
    if (!conector.controlDatabaseAriagro()){
        return done(null, []);
    }
    if(codtipom == 'FAA')
    crearJsonAnticipo(numfactu, campanya, codtipom, informe,(err, result) => {
        if (err) return done(err);
        if (result) {
            /*crearPdfsAnticipo(numfactu, informe, (err, result) => {
                if (err) return done(err);
                done(null, result);
            });*/
        }
    });
}

var crearJsonAnticipo = function(numfactu, campanya, codtipom, informe, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var obj = 
        {
            cabecera_anticipo: "",
            lineas_anticipo: "",
            pie_anticipo: ""
        }
   
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.cifempre AS cifempre, ";
    sql += " f.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, f.codtipom, t.nomtipom, t.letraser";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rsocios AS so ON f.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE f.numfactu = ? AND f.codtipom like ? ";
    sql = mysql.format(sql, [numfactu, '%' + codtipom + '%']);
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        obj.cabecera_anticipo = cab;
        var sql2;
            sql2 = "SELECT f.codvarie, f.imporvar, f.kilogrado, f.kilosnet , f.preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
            sql2 += " FROM rfactsoc_variedad AS f";
            sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
            sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
            sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
            sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            sql2 += " ORDER BY f.codvarie";
            sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        var con2 = conector.getConnectionCampanya(campanya);
        con2.query(sql2, function(err,lineas) {
            con2.end();
            if (err) return callback(err, null);
            obj.lineas_anticipo = lineas;
            var sql3 = "SELECT baseimpo, porc_iva, imporiva, basereten, porc_ret, impreten, totalfac";
            sql3 += " FROM rfactsoc ";
            sql3 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            sql3 = mysql.format(sql3, [numfactu, '%' + codtipom + '%']);
            var con3 = conector.getConnectionCampanya(campanya);
            con3.query(sql3, function(err,pie) {
                con3.end();
                obj.pie_anticipo = pie;
                var resultado = JSON.stringify(obj);
                fs.writeFile(config2.json_dir + "\\factura_anticipo.json", resultado, function(err) {
                    if(err) return callback(err);
                    return callback(null, true);
                });
            });
        });
    });
    
}

var algo = function() {
    
}
