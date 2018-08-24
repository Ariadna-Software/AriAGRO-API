//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var fs = require("fs");
var config2 = require("../../config/config_stireport.json");
var Stimulsoft = require('stimulsoft-reports-js');


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

module.exports.postPrepararCorreos = function (numfactu, campanya, informe, codtipom, servidor, done) {
    if (!conector.controlDatabaseAriagro()){
        return done(null, []);
    }
    if(codtipom == 'FAA') {
        crearJsonAnticipo(numfactu, campanya, codtipom, informe, servidor, (err, result) => {
            if (err) return done(err);
            if (result) {
                crearPdfs(numfactu, informe, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });
            }
        });
    }else {
        crearJsonLiquidacion(numfactu, campanya, codtipom, informe, servidor, (err, result) => {
            if (err) return done(err);
            if (result) {
                /*crearPdfsAnticipo(numfactu, informe, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });*/
            }
        });
    }
}

var crearJsonLiquidacion = function(numfactu, campanya, codtipom, informe, servidor, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var obj = 
        {
            cabecera: "",
            lineas: "",
            anticipos: "",
            pie: ""
        }
   
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.proempre AS proempre, emp.cifempre AS cifempre,";
    sql += " emp.telempre, emp.faxempre, emp.wwwempre,"
    sql += " f.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, so.dirsociocorreo, so.pobsociocorreo, so.codpostalcorreo, f.codtipom, t.nomtipom, t.letraser, f.numfactu, f.fecfactu";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rsocios AS so ON f.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE f.numfactu = ? AND f.codtipom like ? ";
    sql = mysql.format(sql, [numfactu, '%' + codtipom + '%']);
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        obj.cabecera = cab;
        var sql2;
        if(servidor == 1){
            sql2 = "SELECT f.codvarie, SUM(f.imporvar) AS impovar, SUM(f.kilogrado) AS kilogrado, SUM(f.kilosnet) AS kilosnet , f.preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
            sql2 += " FROM rfactsoc_variedad AS f";
            sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
            sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
            sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
            sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            sql2 += " GROUP BY f.codvarie  ORDER BY f.codvarie";
            sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        } else {
            sql2 = "SELECT cal.codvarie, var.nomvarie,r.tipcalid,SUM(cal.imporcal) AS imporcal, SUM(kilosnet) AS kilosnet"
            sql2 += " FROM rfactsoc_calidad cal, rcalidad r, variedades var";
            sql2 += " WHERE cal.numfactu = ? AND cal.codtipom LIKE ? AND";
            sql2 += " cal.codvarie = var.codvarie AND cal.codvarie = r.codvarie AND cal.codcalid = r.codcalid ";
            sql2 += " GROUP BY 1,2,3";
            sql2 += " ORDER BY 1,2,3 ";
            sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        }
        var con2 = conector.getConnectionCampanya(campanya);
        con2.query(sql2, function(err,lineas) {
            con2.end();
            if (err) return callback(err, null);
            if(servidor != 1) {
                lineas = fnFromDbToJsonCalidad(lineas);
            }
            obj.lineas = lineas;
            var sql3 = "SELECT baseimpo, porc_iva, imporiva, basereten, porc_ret, impreten, totalfac";
            sql3 += " FROM rfactsoc ";
            sql3 += " WHERE numfactu = ? AND codtipom like ? ";
            sql3 = mysql.format(sql3, [numfactu, '%' + codtipom + '%']);
            var con3 = conector.getConnectionCampanya(campanya);
            con3.query(sql3, function(err,pie) {
                con3.end();
                if (err) return callback(err, null);
                obj.pie = pie;
                var sql4 = "SELECT ant.*, var.nomvarie FROM rfactsoc_anticipos AS ant ";
                sql4 += " LEFT JOIN variedades AS var ON var.codvarie = ant.codvarieanti";
                sql4 += " WHERE ant.numfactu = ?  AND ant.codtipom LIKE ?"
                sql4 = mysql.format(sql4, [numfactu, '%' + codtipom + '%']);
                var con4 = conector.getConnectionCampanya(campanya);
                con4.query(sql4, function(err, anticipos) {
                    if (err) return callback(err, null);
                    obj.anticipos = anticipos;
                    var resultado = JSON.stringify(obj);
                    fs.writeFile(config2.json_dir + "\\factura_liquidacion.json", resultado, function(err) {
                        if(err) return callback(err);
                        return callback(null, true);
                    });
                });
            });
        });
    });
    
}

var crearJsonAnticipo = function(numfactu, campanya, codtipom, informe, servidor, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var obj = 
        {
            cabecera: "",
            lineas: "",
            pie: "",
            varias: ""
        }
   
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.proempre AS proempre, emp.cifempre AS cifempre,";
    sql += " emp.telempre, emp.faxempre, emp.wwwempre,"
    sql += " f.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, so.dirsociocorreo, so.pobsociocorreo, so.codpostalcorreo, f.codtipom, t.nomtipom, t.letraser, f.numfactu, f.fecfactu";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rsocios AS so ON f.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE f.numfactu = ? AND f.codtipom like ? ";
    sql = mysql.format(sql, [numfactu, '%' + codtipom + '%']);
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        obj.cabecera = cab;
        var sql2;
        if(servidor == 1){//Picassent
            sql2 = "SELECT f.codvarie, SUM(f.imporvar) AS impovar, SUM(f.kilogrado) AS kilogrado, f.kilosnet , f.preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
            sql2 += " FROM rfactsoc_variedad AS f";
            sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
            sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
            sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
            sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            sql2 += " GROUP BY f.codvarie  ORDER BY f.codvarie";
            sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        } else {//Castelduc
            sql2 = "SELECT f.codvarie, SUM(f.imporvar) AS imporvar, SUM(f.kilogrado) AS kilogrado, SUM(f.kilosnet) AS kilosnet , SUM(f.preciomed) AS preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
            sql2 += " FROM rfactsoc_variedad AS f";
            sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
            sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
            sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
            sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            sql2 += " GROUP BY f.codvarie, f.codcampo  ORDER BY f.codvarie";
            sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        }
        var con2 = conector.getConnectionCampanya(campanya);
        con2.query(sql2, function(err,lineas) {
            con2.end();
            if (err) return callback(err, null);
            if(servidor != 1) {//formateo de huertos agrupados por variedades para castelduv
                lineas = fnFromDbToJson(lineas);
            }
            obj.lineas = lineas;
            var sql3 = "SELECT baseimpo, porc_iva, imporiva, basereten, porc_ret, impreten, totalfac";
            sql3 += " FROM rfactsoc ";
            sql3 += " WHERE numfactu = ? AND codtipom like ? ";
            sql3 = mysql.format(sql3, [numfactu, '%' + codtipom + '%']);
            var con3 = conector.getConnectionCampanya(campanya);
            con3.query(sql3, function(err,pie) {
                con3.end();
                if (err) return callback(err, null);
                obj.pie = pie;
                var sql4 = "SELECT var.codtipom, var.numfactu, var.fecfactu, var.codtipomfvar, RIGHT(CONCAT('0000000',var.numfactufvar),7) AS numfactufvarias, var.fecfactufvar,";
                sql4 += " var.codsecci, f.totalfac";
                sql4 += " FROM rfactsoc_fvarias AS var";
                sql4+= " LEFT JOIN fvarcabfact  AS f ON f.numfactu = var.numfactufvar";
                sql4 += " WHERE var.numfactu = ?  AND var.codtipom LIKE ?"
                sql4 = mysql.format(sql4, [numfactu, '%' + codtipom + '%']);
                var con4 = conector.getConnectionCampanya(campanya);
                con4.query(sql4, function(err, varias) {
                    if (err) return callback(err, null);
                    obj.varias = varias;
                    var resultado = JSON.stringify(obj);
                    fs.writeFile(config2.json_dir + "\\factura_anticipo.json", resultado, function(err) {
                        if(err) return callback(err);
                        return callback(null, true);
                    });
                });
            });
        });
    });
    
}

var fnFromDbToJson = function(lineas) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var antCodvarie = 0;
    
    for (var i = 0; i < lineas.length; i++) {
        var f = lineas[i];
        if (f.codvarie != antCodvarie) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                codvarie: f.codvarie,
                nomvarie: f.nomvarie,
                huertos: []
            };
            
            antCodvarie = f.codvarie;
        }
        // siempre se procesa una linea
        if (f.codcampo) {
            linJs = {
                codvarie: f.codvarie,
                codcampo: f.codcampo,
                nomparti: f.nomparti,
                imporvar: f.imporvar,
                kilosnet: f.kilosnet,
                preciomed: f.preciomed
            };
            cabJs.huertos.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}

var fnFromDbToJsonCalidad = function(lineas) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var antCodvarie = 0;
    
    for (var i = 0; i < lineas.length; i++) {
        var f = lineas[i];
        if (f.codvarie != antCodvarie) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                codvarie: f.codvarie,
                nomvarie: f.nomvarie,
                calidades: []
            };
            
            antCodvarie = f.codvarie;
        }
        // siempre se procesa una linea
        if (f.codvarie) {
            linJs = {
                codvarie: f.codvarie,
                tipcalid: f.tipcalid,
                imporcal: f.imporcal,
                kilosnet: f.kilosnet
            };
            cabJs.calidades.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}

//metodo para diccionario archivo json
var crearPdfs = function (numfactu, informe, callback) {
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

            fs.writeFile(config2.clasif_dir + "\\" + numfactu + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });
            var ruta = config2.clasif_dir + "\\" + numfactu + ".pdf";
            callback(null, ruta);
        });
}
