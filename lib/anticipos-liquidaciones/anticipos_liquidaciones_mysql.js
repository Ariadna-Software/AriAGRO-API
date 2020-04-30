//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var fs = require("fs");
//var cfg = require('../../config/config.json');
var Stimulsoft = require('stimulsoft-reports-js');

var moment = require('moment');
var envCorreo = require('../comun/enviar_correos');


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
    sql += " l.kilosnet,";
    sql += " l.imporvar,"
    sql += " t.tipodocu";
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
                tipodocu: f.tipodocu,
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

module.exports.postPrepararCorreos = function (fecfactu, numfactu, campanya, informe, codtipom, servidor, done) {
    if (!conector.controlDatabaseAriagro()){
        return done(null, []);
    }
    if(codtipom == 'FAA' || codtipom == 'BAA') {
        crearJsonAnticipo(fecfactu, numfactu, campanya, codtipom, informe, servidor, (err, obj) => {
            if (err) return done(err);
            if (obj) {
                crearPdfs(numfactu, informe, obj, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });
            }
        });
    }
    if(codtipom == 'FAL' || codtipom == 'BAL') {
        crearJsonLiquidacion(fecfactu, numfactu, campanya, codtipom, informe, servidor, (err, obj) => {
            if (err) return done(err);
            if (obj) {
                crearPdfs(numfactu, informe, obj, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });
            }
        });
    }
}

module.exports.postPrepararCorreosNuevo = function (fecfactu, paramCentral, numfactu, campanya, informe, codtipom, servidor, done) {
    if (!conector.controlDatabaseAriagro()){
        return done(null, []);
    }
    if(paramCentral == 'anticipo' || paramCentral == 'anticipo BOLBAITE') {
        crearJsonAnticipo(fecfactu, numfactu, campanya, codtipom, informe, servidor, (err, obj) => {
            if (err) return done(err);
            if (obj) {
                crearPdfs(numfactu, informe, obj, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });
            }
        });
    } else {
        crearJsonLiquidacion(fecfactu, numfactu, campanya, codtipom, informe, servidor, (err, obj) => {
            if (err) return done(err);
            if (obj) {
                crearPdfs(numfactu, informe, obj, (err, result) => {
                    if (err) return done(err);
                    done(null, result);
                });
            }
        });
    }
}


module.exports.postEnviarCorreos = function (numfactu, email, ruta , coop, codtipom, done) {
    // TODO: Hay que montar los correos propiamente dichos
    envCorreo.crearCorreosAEnviar(numfactu, email, ruta, coop, codtipom, (err, data) => {
        if (err) return done(err);
        var msg = data;
        done(null, msg);
    });
}


var crearJsonLiquidacion = function(fecfactu, numfactu, campanya, codtipom, informe, servidor, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var obj = 
        {
            cabecera: "",
            lineas: "",
            lineasBis: "",
            anticipos: "",
            gastos: "",
            pie: ""
        }
   
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.proempre AS proempre, emp.cifempre AS cifempre,";
    sql += " emp.telempre, emp.faxempre, emp.wwwempre,"
    sql += " f.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, so.dirsociocorreo, so.pobsociocorreo, so.codpostalcorreo, f.codtipom, t.nomtipom, t.letraser, f.numfactu, f.fecfactu AS fecfactu";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rsocios AS so ON f.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE f.numfactu = ? AND f.codtipom like ? ";
    if(fecfactu) {
        sql += " AND f.fecfactu = '" + fecfactu + "'";
    }
    sql = mysql.format(sql, [numfactu, '%' + codtipom + '%']);
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        cab[0].fecfactu = moment(cab[0].fecfactu).format('DD/MM/YYYY');
        obj.cabecera = cab;
        var sql2;
        sql2 = "SELECT f.codvarie, SUM(f.imporvar) AS impovar, SUM(f.kilogrado) AS kilogrado, SUM(f.kilosnet) AS kilosnet,";
        sql2 += "  ROUND(COALESCE(SUM(f.imporvar)/SUM(f.kilosnet), 0), 4) AS preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
        sql2 += " FROM rfactsoc_variedad AS f";
        sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
        sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
        sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
        sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
        if(fecfactu) {
            sql2 += " AND f.fecfactu = '" + fecfactu + "'";
        }
        sql2 += " GROUP BY f.codvarie  ORDER BY f.codvarie";
        sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        var con2 = conector.getConnectionCampanya(campanya);
        con2.query(sql2, function(err,lineas) {
            con2.end();
            if (err) return callback(err, null);
            obj.lineas = lineas;
            var sql2Bis = "SELECT cal.codvarie, var.nomvarie,r.tipcalid1, SUM(kilosnet) AS kilosnet, "
            sql2Bis +=  " SUM(IF(cal.preciocalidad > 0, cal.imporcalidad, 0)) AS imporcal,"
            sql2Bis += " SUM(IF(cal.imporcalidad <= 0 OR r.tipcalid1 = 1, cal.imporcalidad, 0)) AS imporcalnocomer"
            sql2Bis += " FROM rfactsoc_calidad cal, rcalidad r, variedades var";
            sql2Bis += " WHERE cal.numfactu = ? AND cal.codtipom LIKE ? AND";
            sql2Bis += " cal.codvarie = var.codvarie AND cal.codvarie = r.codvarie AND cal.codcalid = r.codcalid ";
            if(fecfactu) {
                sql2Bis += " AND cal.fecfactu = '" + fecfactu + "'";
            }
            sql2Bis += " GROUP BY 1,2,3";
            sql2Bis += " ORDER BY 1,2,3 ";
            sql2Bis = mysql.format(sql2Bis, [numfactu, '%' + codtipom + '%']);
            var con2Bis = conector.getConnectionCampanya(campanya);
            con2Bis.query(sql2Bis, function(err,lineasBis) {
                con2Bis.end();
                if(err) return callback(err);
                if(lineasBis.length == 0) {
                    lineasBis.codvarie = 0;
                }
                obj.lineasBis = lineasBis;

                var sqlgas = " SELECT COALESCE(SUM(imporgasto), 0) AS gasto FROM rfactsoc_albaran WHERE  numfactu = ? AND codtipom LIKE ?"
                if(fecfactu) {
                    sqlgas += " AND fecfactu = '" + fecfactu + "'";
                }
                sqlgas  = mysql.format(sqlgas, [numfactu, '%' + codtipom + '%']);
                var congast = conector.getConnectionCampanya(campanya);
                congast.query(sqlgas, function(err, gastos) { 
                    congast.end();
                    if(err) return callback(err);
                    obj.gastos = gastos;
                    var sql3 = "SELECT baseimpo, porc_iva, imporiva, basereten, porc_ret, impreten, totalfac";
                sql3 += " FROM rfactsoc ";
                sql3 += " WHERE numfactu = ? AND codtipom like ? ";
                if(fecfactu) {
                    sql3 += " AND fecfactu = '" + fecfactu + "'";
                }
                sql3 = mysql.format(sql3, [numfactu, '%' + codtipom + '%']);
                var con3 = conector.getConnectionCampanya(campanya);
                con3.query(sql3, function(err,pie) {
                    con3.end();
                    if (err) return callback(err, null);
                    obj.pie = pie;
                    var sql4 = "SELECT ant.fecfactu AS fecfactu, ant.codtipom, ant.numfactu, ant.codtipomanti,";
                    sql4 += " ant.numfactuanti, ant.fecfactuanti AS fecfactuanti, ant.codvarieanti, ant.codcampoanti,";
                    sql4 += " ant.codcampoanti, ant.baseimpo, var.nomvarie FROM rfactsoc_anticipos AS ant";
                    sql4 += "  LEFT JOIN variedades AS var ON var.codvarie = ant.codvarieanti";
                    sql4 += " WHERE ant.numfactu = ?  AND ant.codtipom LIKE ?"
                    if(fecfactu) {
                        sql4 += " AND ant.fecfactu = '" + fecfactu + "'";
                    }
                    sql4 = mysql.format(sql4, [numfactu, '%' + codtipom + '%']);
                    var con4 = conector.getConnectionCampanya(campanya);
                    con4.query(sql4, function(err, anticipos) {
                        con4.end();
                        if (err) return callback(err, null);
                        if(anticipos.length > 0){
                            for(var i = 0; i < anticipos.length; i++) {
                                anticipos[i].fecfactu = moment(anticipos[i].fecfactu).format('DD/MM/YYYY');
                                anticipos[i].fecfactuanti = moment(anticipos[i].fecfactuanti).format('DD/MM/YYYY');
                            }
                        }
                        obj.anticipos = anticipos;

                        return callback(null, obj);
                    });
                });

                });
            });
        });
    });
    
}


var crearJsonAnticipo = function(fecfactu, numfactu, campanya, codtipom, informe, servidor, callback) {
    var con = conector.getConnectionCampanya(campanya);
    var obj = 
        {
            cabecera: "",
            lineas: "",
            lineasBis: "",
            pie: "",
            varias: "",
            result: ""
        }
    var sql = "SELECT emp.nomempre AS nomempre, emp.domempre AS domempre, emp.codpobla AS codpobla, emp.pobempre AS pobempre, emp.proempre AS proempre, emp.cifempre AS cifempre,";
    sql += " emp.telempre, emp.faxempre, emp.wwwempre,"
    sql += " f.codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, so.dirsociocorreo, so.pobsociocorreo, so.codpostalcorreo, f.codtipom, t.nomtipom, t.letraser, f.numfactu, f.fecfactu AS fecfactu";
    sql += " FROM rfactsoc AS f";
    sql += " LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom";
    sql += " LEFT JOIN rsocios AS so ON f.codsocio = so.codsocio";
    sql += " LEFT JOIN empresas AS emp ON 1=1";
    sql += " WHERE f.numfactu = ? AND f.codtipom like ? ";
    if(fecfactu) {
        sql += " AND f.fecfactu = '" + fecfactu + "'";
    }
    sql = mysql.format(sql, [numfactu, '%' + codtipom + '%']);
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        cab[0].fecfactu = moment(cab[0].fecfactu).format('DD/MM/YYYY');
        obj.cabecera = cab;
        var sql2;
        //Picasent
        sql2 = "SELECT f.codvarie, SUM(f.imporvar) AS impovar, SUM(f.kilogrado) AS kilogrado, f.kilosnet , f.preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
        sql2 += " FROM rfactsoc_variedad AS f";
        sql2 += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
        sql2 += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
        sql2 += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
        sql2 += " WHERE f.numfactu = ? AND f.codtipom like ? ";
        if(fecfactu) {
            sql2 += " AND f.fecfactu =  '" + fecfactu + "'";
        }
        sql2 += " GROUP BY f.codvarie  ORDER BY f.codvarie";
        sql2 = mysql.format(sql2, [numfactu, '%' + codtipom + '%']);
        var con2 = conector.getConnectionCampanya(campanya);
        con2.query(sql2, function(err,lineas) {
            con2.end();
            if (err) return callback(err, null);
            obj.lineas = lineas;
            //Castelduc
            var sql2Bis = "SELECT f.codvarie, SUM(f.imporvar) AS imporvar, SUM(f.kilogrado) AS kilogrado, SUM(f.kilosnet) AS kilosnet , ROUND(COALESCE(SUM(f.imporvar)/SUM(f.kilosnet), 0), 4) AS preciomed, f.codcampo, var.nomvarie, par.nomparti, par.codparti"
            sql2Bis += " FROM rfactsoc_variedad AS f";
            sql2Bis += " LEFT JOIN variedades AS var ON var.codvarie = f.codvarie";
            sql2Bis += " LEFT JOIN rcampos AS cam ON cam.codcampo = f.codcampo";
            sql2Bis += " LEFT JOIN rpartida AS par ON cam.codparti = par.codparti";
            sql2Bis += " WHERE f.numfactu = ? AND f.codtipom like ? ";
            if(fecfactu) {
                sql2Bis += " AND f.fecfactu =  '" + fecfactu + "'";
            }
            sql2Bis += " GROUP BY f.codvarie, f.codcampo  ORDER BY f.codvarie";
            sql2Bis = mysql.format(sql2Bis, [numfactu, '%' + codtipom + '%']);
            var con2Bis = conector.getConnectionCampanya(campanya);
            con2Bis.query(sql2Bis, function(err,lineasBis) {
                con2Bis.end();
                if(err) return callback(err);
                
                obj.lineasBis = lineasBis;
                var sql3 = "SELECT baseimpo, porc_iva, imporiva, basereten, porc_ret, impreten, totalfac";
                sql3 += " FROM rfactsoc ";
                sql3 += " WHERE numfactu = ? AND codtipom like ? ";
                if(fecfactu) {
                    sql3 += " AND fecfactu = '" + fecfactu + "'";
                }
                sql3 = mysql.format(sql3, [numfactu, '%' + codtipom + '%']);
                var con3 = conector.getConnectionCampanya(campanya);
                con3.query(sql3, function(err,pie) {
                    con3.end();
                    if (err) return callback(err, null);
                    obj.pie = pie;
                    var sql4 = "SELECT var.codtipom, var.numfactu, var.fecfactu AS fecfactu, COALESCE(SUM(cab.totalfac), 0) AS totalfac,";
                    sql4 += " var.codtipomfvar, RIGHT(CONCAT('0000000',var.numfactufvar),7) AS numfactufvarias,";
                    sql4 += " var.fecfactufvar AS fecfactufvar, var.codsecci FROM rfactsoc_fvarias AS var  ";
                    sql4 += " LEFT JOIN fvarcabfact AS cab ON cab.numfactu = var.numfactufvar AND var.codtipomfvar = cab.codtipom ";
                  
                    sql4 += " WHERE var.numfactu = ? AND var.codtipom LIKE ?";
                    if(fecfactu) {
                        sql4 += " AND var.fecfactu = '" + fecfactu + "'";
                    }
                    
                    sql4 += " GROUP BY var.numfactufvar, var.codtipomfvar";
                    sql4 += " ORDER BY var.numfactufvar DESC";
                   
                    sql4 = mysql.format(sql4, [numfactu, '%' + codtipom + '%']);
                    var con4 = conector.getConnectionCampanya(campanya);
                    con4.query(sql4, function(err, varias) {
                        con4.end();
                        if (err) return callback(err, null);
                        var resultado = 0;
                        if(varias.length > 0) {
                           
                            for(var i = 0; i < varias.length; i++) {
                                resultado += varias[i].totalfac;
                                
                                varias[i].fecfactu = moment(varias[i].fecfactu).format('DD/MM/YYYY');
                                varias[i].fecfactufvar = moment(varias[i].fecfactufvar).format('DD/MM/YYYY');
                                varias[i].numfactufvarias = varias[i].numfactufvarias.toString();
                            }
                            
                        
                            obj.varias = varias;
                        } else {
                            obj.varias = [{totalfac: 0, totalvarias: 0, result: 0}]
                        }
                        resultado = pie[0].totalfac - resultado;
                        obj.result = [{resultado: resultado}];
                        return callback(null, obj);
                    });
                });
            });
        });
    });
    
}

var fnFromDbToJson = function(lineas) {
    //agrupamos las lineas devueltas por variedades y por campos
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
                tipcalid: f.tipcalid1,
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
var crearPdfs = function (numfactu, informe, obj, callback) {
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
       
        var file = process.env.REPORTS_DIR + "\\" + informe;
        var report = new Stimulsoft.Report.StiReport();
            
            
        report.loadFile(file);

        var dataSet = new Stimulsoft.System.Data.DataSet("liq_ant");
        dataSet.readJson(obj);
        
         // Remove all connections from the report template
         report.dictionary.databases.clear();
    
         //
        report.regData(dataSet.dataSetName, "", dataSet);
        report.dictionary.synchronize();

       /*  var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.JSON_DIR + "\\factura_anticipo_bolbaite.json", resultado, function(err) {
            //if(err) return callback(err);
            //return callback(null, true);
        }); */

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

            /*fs.writeFile(cfg.CLASIF_DIR + "\\" + numfactu + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });*/
           
            callback(null, data);
        });
}

