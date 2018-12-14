//-----------------------------------------------------------------
// usuario_mysql
// implementa el acceso a la basde de datos mysql
//-----------------------------------------------------------------

var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
//var cfg = require('../../config/config.json');
var moment = require('moment');
var Stimulsoft = require('stimulsoft-reports-js');
var envCorreo = require('../comun/enviar_correos')


//importacion de configuración .env
var config = require('dotenv');
config.config();



// [export] getLogin
// 
module.exports.getCamposSocio = function(codsocio, campanya, callback) {
    if (!conector.controlDatabaseAriagro()) {
        return callback(null, []);
    }
    var usuario = null;
    var sql = "SELECT c.codsocio, c.codcampo, c.nrocampo,v.nomvarie,";
    sql += " nomparti, poligono, parcela, recintos,";
    sql += " COALESCE(k.kilos,0) AS kilostot,";
    sql += " h.numalbar, h.fecalbar, numcajon, kilosnet";
    sql += " FROM rcampos AS c";
    sql += " LEFT JOIN variedades AS v ON v.codvarie = c.codvarie";
    sql += " LEFT JOIN rpartida AS p ON p.codparti = c.codparti";
    sql += " LEFT JOIN (SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta GROUP BY codcampo) AS k ON k.codcampo = c.codcampo";
    sql += " LEFT JOIN rhisfruta AS h ON h.codcampo = c.codcampo";
    sql += " WHERE c.fecbajas IS NULL ";
    sql += " AND c.codsocio = ?";
    sql += " ORDER BY v.nomvarie, c.codcampo, h.fecalbar DESC"
    sql = mysql.format(sql, codsocio);
    var connection = conector.getConnectionCampanya(campanya);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, fnCamposFromDbToJson(result));
    });

};

module.exports.getCampoClasificacion = function(codcampo, campanya, callback){
    if (!conector.controlDatabaseAriagro()) {
        return callback(null, []);
    }

    var sql = "SELECT  rhisfruta_clasif.codcalid, rcalidad.nomcalid AS calidad, SUM(rhisfruta_clasif.kilosnet) AS kilos";
    sql += " FROM (rhisfruta_clasif INNER JOIN rcalidad ON rhisfruta_clasif.codvarie = rcalidad.codvarie AND rhisfruta_clasif.codcalid = rcalidad.codcalid )";
    sql += " INNER JOIN rhisfruta ON rhisfruta.numalbar = rhisfruta_clasif.numalbar"; 
    sql += " WHERE rhisfruta.codcampo = ?"; 
    sql += " GROUP BY 1,2"; 
    sql += " ORDER BY 1,2;";
    sql = mysql.format(sql, codcampo);
    var connection = conector.getConnectionCampanya(campanya);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
}

module.exports.getAlbaranClasificacion = function(numalbar, campanya, callback){
    var resultado = [];
    if (!conector.controlDatabaseAriagro()) {
        return callback(null, []);
    }

    var sql = " SELECT rhisfruta_clasif.codcalid, rcalidad.nomcalid AS calidad, rhisfruta_clasif.kilosnet AS kilos";
    sql += " FROM rhisfruta_clasif INNER JOIN rcalidad ON rhisfruta_clasif.codvarie = rcalidad.codvarie";
    sql += " AND rhisfruta_clasif.codcalid = rcalidad.codcalid"; 
    sql += " WHERE rhisfruta_clasif.numalbar = ?;"; 
    sql = mysql.format(sql, numalbar);
    var connection = conector.getConnectionCampanya(campanya);
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        var clasificacion = result;
        resultado.push(clasificacion);
        var sql2 = "SELECT DISTINCT inc.numalbar, inc.codincid, rin.tipincid, rin.nomincid FROM rhisfruta_incidencia AS inc";
        sql2 += " LEFT JOIN rincidencia AS rin ON rin.codincid = inc.codincid";
        sql2 += " where numalbar = ?";
        sql2 = mysql.format(sql2, numalbar);
        var con = conector.getConnectionCampanya(campanya);
        con.query(sql2, function(err, result2) {
            conector.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            var incidencia = result2;
            resultado.push(incidencia);
            return callback(null, resultado);
        });
    });
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
    sql += " RIGHT(CONCAT('000000',c.codsocio),6) AS codsocio, so.nomsocio, so.dirsocio, so.codpostal, so.pobsocio, so.prosocio, so.nifsocio, c.codcampo, c.nrocampo, v.nomvarie, ";
    sql += " nomparti, poligono, parcela, recintos, COALESCE(k.kilos,0) AS kilostot, h.numalbar, h.fecalbar AS fecalbar, numcajon, kilosnet";
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
        cab[0].fecalbar = moment(cab[0].fecalbar).format('DD/MM/YYYY');
        cab[0].codsocio = cab[0].codsocio.toString();
        obj.cabecera_agro = cab;
        
        var con2 = conector.getConnectionCampanya(campanya);
        var sql2 = "SELECT ent.numalbar, ent.tiporecol,ent.numnotac, ent.fechaent AS fechaent, ent.kilosnet, ent.numcajon, ri.tipoentr";
        sql2 += " FROM rhisfruta_entradas AS ent"; 
        sql2 += " LEFT JOIN rhisfruta AS ri ON ri.numalbar = ent.numalbar";
        sql2 += " WHERE ent.numalbar = " + numalbar;
        con2.query(sql2, function (err, entrada) {
            con2.end();
            if (err) return callback(err, null);
            if(entrada.length > 0) {
                for(var i = 0; i< entrada.length; i++) {
                    entrada[i].fechaent =  moment(entrada[i].fechaent).format('DD/MM/YYYY');
                }
            }
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
                var sql4 = "SELECT DISTINCT inc.numalbar, inc.codincid, rin.tipincid, rin.nomincid FROM rhisfruta_incidencia AS inc";
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


//metodo para diccionarilo archivo json
var crearPdfsClasif = function (numalbar, informe, obj, callback) {
    Stimulsoft.Base.StiLicense.key = process.env.sti_Key
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
        var file = process.env.reports_dir + "\\" + informe;
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


            

            /*fs.writeFile(process.env.clasif_dir + "\\" + numalbar + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });*/
            var ruta = data;
            callback(null, ruta);
        });
}

module.exports.postEnviarCorreos = function (numalbar, email, ruta , coop, done) {
    // TODO: Hay que montar los correos propiamente dichos
    var codtipom = null;
    envCorreo.crearCorreosAEnviar(numalbar, email, ruta, coop, codtipom,(err, data) => {
        if (err) return done(err);
        var msg = data;
        done(null, msg);
    })
}

var fnCamposFromDbToJson = function(campos) {
    var pdJs = [];
    var cabVs = null;
    var cabJs = null;
    var linJs = null;
    var codcampoAnt = 0;
    var nomVarieAnt = '';
    var nkilos = 0;
    for (var i = 0; i < campos.length; i++) {
        var c = campos[i];
        if (nomVarieAnt != c.nomvarie) {
            if (cabVs) {
                if (cabJs) {
                    cabVs.campos.push(cabJs);
                    cabJs = null;
                }
                cabVs.numkilos = nkilos;
                pdJs.push(cabVs);
            }
            cabVs = {
                nomvarie: c.nomvarie,
                numkilos: 0,
                campos: []
            };
            nomVarieAnt = c.nomvarie;
            nkilos = 0;
        }
        if (codcampoAnt != c.codcampo) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                cabVs.campos.push(cabJs);
            }
            cabJs = {
                codsocio: c.codsocio,
                numcampo: c.nrocampo,
                codcampo: c.codcampo,
                nomvarie: c.nomvarie,
                nomparti: c.nomparti,
                poligono: c.poligono,
                parcela: c.parcela,
                recintos: c.recintos,
                kilos: c.kilostot,
                entradas: []
            };
            nkilos += c.kilostot;
            codcampoAnt = c.codcampo;
        }
        // siempre se procesa una linea
        if (c.numalbar) {
            linJs = {
                numalbar: c.numalbar,
                fecalbar: c.fecalbar,
                numcajon: c.numcajon,
                kilosnet: c.kilosnet
            };
            cabJs.entradas.push(linJs);
        }
    }
    if (cabJs) {
        cabVs.campos.push(cabJs);
    }
    if (cabVs) {
        cabVs.numkilos = nkilos;
        pdJs.push(cabVs);
    }
    return pdJs;
}
