var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');
var cfg = require('../../config/config.json');
var Stimulsoft = require('stimulsoft-reports-js');
var fs = require("fs");


module.exports.getFacturasGasolineraCliente = function(codclien, year, callback) {
    var facturas = [];

    if (!conector.controlDatabaseGasolinera()){
        return callback(null, facturas);
    }

    var sql = "";
    var connection = null;
    if (config.gasolinera.database == "ariagroutil") {
        // En este caso hay que trabajar sobre una base de datos distinta
        // y distintas tablas
        sql = "SELECT fc.codsocio, fc.letraser, fc.numfactu, fc.fecfactu,";
        sql += " fc.base AS bases,";
        sql += " fc.iva AS cuotas,";
        sql += " 0 AS impuesto, fc.total AS totalfac,";
        sql += " fl.numlinea, 0 AS numalbar, fl.fecalbar,";
        sql += " fl.nomartic, fl.cantidad, fl.preciove, fl.implinea";
        sql += " FROM gascabfac AS fc";
        sql += " LEFT JOIN gaslinfac AS fl ON fl.letraser = fc.letraser AND fl.numfactu = fc.numfactu AND fl.fecfactu = fc.fecfactu";
        sql += " WHERE fc.codsocio = ? AND YEAR(fc.fecfactu) = ?"
        sql += " ORDER BY fc.fecfactu DESC, fc.letraser, fc.numfactu";
        sql = mysql.format(sql, [codclien, year]);
        connection = conector.getConnectionGeneral("ariagroutil");
    } else {
        // es la base de arigasol normal
        sql = "SELECT fc.codsocio, fc.letraser, fc.numfactu, fc.fecfactu, ";
        sql += " (COALESCE(fc.baseimp1,0) + COALESCE(fc.baseimp2,0) + COALESCE(fc.baseimp3,0)) AS bases,";
        sql += " (COALESCE(fc.impoiva1,0) + COALESCE(fc.impoiva2,0) + COALESCE(fc.impoiva3,0)) AS cuotas,";
        sql += " fc.impuesto, fc.totalfac,";
        sql += " fl.numlinea, fl.numalbar, fl.fecalbar,";
        sql += " a.nomartic, fl.cantidad, fl.preciove, fl.implinea";
        sql += " FROM schfac AS fc";
        sql += " LEFT JOIN slhfac AS fl ON fl.letraser = fc.letraser AND fl.numfactu = fc.numfactu AND fl.fecfactu = fc.fecfactu";
        sql += " LEFT JOIN sartic AS a ON a.codartic = fl.codartic";
        sql += " WHERE fc.codsocio = ? AND YEAR(fc.fecfactu) = ?"
        sql += " ORDER BY fc.fecfactu DESC, fc.letraser, fc.numfactu"
        sql = mysql.format(sql, [codclien, year]);
        connection = conector.getConnectionGasolinera();
    }
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        // hay que procesar a JSON
        return callback(null, fnFacturasFromDbToJson(result));
    });
};

module.exports.postPrepararCorreosGasol = function (codclien, year, numfactu, letraser, informe, done) {
    

    crearJsonGasol(codclien, year, numfactu, letraser, (err, obj) => {
        if (err) return done(err);
        if (obj) {
            crearPdfsGasol(numfactu, informe, obj, (err, result) => {
                if (err) return done(err);
                done(null, result);
            });
        }
    });
}

var crearJsonGasol = function(codclien, year, numfactu, letraser, callback) {

    var facturas = [];

    if (!conector.controlDatabaseGasolinera()){
        return callback(null, facturas);
    }

    var con = null;

    var obj = 
        {
            gasol_fact: "",    
        }
   
    var sql = "SELECT fc.codsocio, so.nomsocio, so.domsocio, so.codposta, so.pobsocio, so.prosocio, so.nifsocio, fc.letraser, fc.numfactu, DATE_FORMAT(fc.fecfactu, '%Y-%m-%d') AS fecfactu,";
    sql += " emp.nomempre, emp.domempre, emp.codpobla, emp.pobempre, emp.proempre, emp.cifempre,"
    sql += " (COALESCE(fc.baseimp1,0) + COALESCE(fc.baseimp2,0) + COALESCE(fc.baseimp3,0)) AS bases, "
    sql += " (COALESCE(fc.impoiva1,0) + COALESCE(fc.impoiva2,0) + COALESCE(fc.impoiva3,0)) AS cuotas,";
    sql += " COALESCE(fc.baseimp1,0) AS baseimp1, COALESCE(fc.baseimp2 ,0) AS baseimp2, COALESCE(fc.baseimp3,0) AS baseimp3,";
    sql += " COALESCE(fc.impoiva1,0) AS impoiva1, COALESCE(fc.impoiva2,0) AS impoiva2, COALESCE(fc.impoiva3,0) AS impoiva3,"
    sql += " COALESCE(fc.porciva1,0) AS pociva1, COALESCE(fc.porciva2,0) AS porciva2, COALESCE(fc.porciva3,0) AS porciva3,";
    sql += " fc.impuesto, fc.totalfac, fl.numlinea, fl.numalbar, DATE_FORMAT(fl.fecalbar, '%Y-%m-%d') as fecalbar, DATE_FORMAT(fl.horalbar, '%Y-%m-%y %H:%i:%s') AS horalbar, a.nomartic, fl.cantidad, fl.preciove, fl.implinea ";
    sql += " FROM schfac AS fc";
    sql += " LEFT JOIN slhfac AS fl ON fl.letraser = fc.letraser AND fl.numfactu = fc.numfactu AND fl.fecfactu = fc.fecfactu";
    sql += " LEFT JOIN sartic AS a ON a.codartic = fl.codartic";
    sql += " LEFT JOIN ssocio AS so ON so.codsocio = fc.codsocio";
    sql += " LEFT JOIN ariagro.empresas AS emp ON 1=1";
    sql += " WHERE fc.codsocio = ? AND YEAR(fc.fecfactu) = ? AND fc.numfactu = ? AND fc.letraser = ?";
    sql += " ORDER BY fc.fecfactu DESC, fc.letraser, fc.numfactu";
    sql = mysql.format(sql, [codclien, year, numfactu, letraser]);
    con = conector.getConnectionGasolinera();
    con.query(sql, function (err, cab) {
        con.end();
        if (err) return callback(err, null);
        obj.gasol_fact = cab;
        return callback(null, obj);
    });
    
}

//metodo para diccionario archivo json
var crearPdfsGasol = function (numfactu, informe, obj, callback) {
    Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
        "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
        "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
        "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
        "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
        "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
        "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
       
        var file = cfg.reports_dir + "\\" + informe;
        var report = new Stimulsoft.Report.StiReport();
            
            
        report.loadFile(file);

        var dataSet = new Stimulsoft.System.Data.DataSet("liq_ant");
        dataSet.readJson(obj);
        
         // Remove all connections from the report template
         report.dictionary.databases.clear();
    
         //
        report.regData(dataSet.dataSetName, "", dataSet);
        report.dictionary.synchronize();

        var resultado = JSON.stringify(obj);
        /*fs.writeFile(cfg.json_dir + "\\FGAS_castelduc.json", resultado, function(err) {
            if(err) return callback(err);
            return callback(null, true);
        });*/

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

            fs.writeFile(cfg.clasif_dir + "\\" + numfactu + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });
            var ruta = cfg.clasif_dir + "\\" + numfactu + ".pdf";
            callback(null, ruta);
        });
}

module.exports.postEnviarCorreosTienda = function (numfactu, email, ruta , coop, codtipom, done) {
    // TODO: Hay que montar los correos propiamente dichos
    envCorreo.crearCorreosAEnviar(numfactu, email, ruta, coop, codtipom, (err, data) => {
        if (err) return done(err);
        var msg = data;
        done(null, msg);
    })
}


var fnFacturasFromDbToJson = function(facturas) {
    var fcJs = [];
    var cabJs = null;
    var linJs = null;
    var letraserAnt = "";
    var numfactuAnt = 0;
    var fecfactuAnt = 0;
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];
        if (letraserAnt != factura.letraser || numfactuAnt != factura.numfactu) {
            // es una factura nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                fcJs.push(cabJs);
            }
            cabJs = {
                codsocio: factura.codsocio,
                letraser: factura.letraser,
                numfactu: factura.letraser + "-" + factura.numfactu,
                numfactuSin: factura.numfactu,
                fecfactu: factura.fecfactu,
                bases: factura.bases,
                cuotas: factura.cuotas,
                impuesto: factura.impuesto,
                totalfac: factura.totalfac,
                lineas: []
            };
            letraserAnt = factura.letraser;
            numfactuAnt = factura.numfactu;
            fecfactuAnt = factura.fecfactu;
        }
        // siempre se procesa una linea
        if (factura.numlinea) {
            linJs = {
                numlinea: factura.numlinea,
                numalbar: factura.numalbar,
                fecalbar: factura.fecalbar,
                nomartic: factura.nomartic,
                cantidad: factura.cantidad,
                preciove: factura.preciove,
                implinea: factura.implinea
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}
