var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
var config = require('../../config/mysql_config.json');
var cfg = require('../../config/config.json');
var Stimulsoft = require('stimulsoft-reports-js');
var fs = require("fs");
var nodemailer = require('nodemailer');

module.exports.getFacturasTiendaCliente = function(codclien, year, callback) {
    var facturas = [];

    if (!conector.controlDatabaseTienda()){
        // no hay tienda, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }
    
    var sql = "SELECT";
    sql += " f.codtipom AS codtipom,";
    sql += " f.numfactu AS numfactu,";
    sql += " f.fecfactu AS fecfactu,";
    sql += " st.letraser AS letraser,";
    sql += " (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,";
    sql += " (COALESCE(f.imporiv1,0) + COALESCE(f.imporiv2,0) + COALESCE(f.imporiv3,0)";
    sql += " + COALESCE(f.imporiv1re,0) + COALESCE(f.imporiv2re,0) + COALESCE(f.imporiv3re,0)) AS cuotas,";
    sql += " f.totalfac AS totalfac,";
    sql += " lf.codtipoa AS codtipoa,";
    sql += " lf.numalbar AS numalbar,"
    sql += " lf.numlinea AS numlinea,";
    sql += " lf.codartic AS codartic,";
    sql += " lf.nomartic AS nomartic,";
    sql += " lf.precioar AS precioar,";
    sql += " lf.cantidad AS cantidad,";
    sql += " lf.dtoline1 AS dtoline1,";
    sql += " lf.dtoline2 AS dtoline2,";
    sql += " lf.importel AS importel";
    sql += " FROM scafac AS f";
    sql += " LEFT JOIN slifac AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
    sql += " LEFT JOIN stipom AS st ON st.codtipom = f.codtipom"
    sql += " WHERE f.codclien = ? AND YEAR(f.fecfactu) = ?";
    // como hay gente que tiene la telefonía y la tienda en la misma base de datos lo que hacemos es
    // buscar las específicas de tipo si nos las han puesto.
    if (config.tienda.tipo_fac_tienda && config.tienda.tipo_fac_tienda.length > 0){
        sql += " AND f.codtipom IN (" + conector.sqlInString(config.tienda.tipo_fac_tienda) + ")";
    }
    sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.codtipoa, lf.numalbar, lf.numlinea;";
    sql = mysql.format(sql, [codclien, year]);
    var connection = conector.getConnectionTienda();
    connection.query(sql, function(err, result) {
        conector.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        // hay que procesar a JSON
        return callback(null, fnFacturasFromDbToJson(result));
    });
};

module.exports.postPrepararCorreosTienda = function (codclien, year, numfactu, letraser, informe, done) {
    

    crearJsonTienda(codclien, year, numfactu, letraser, (err, obj) => {
        if (err) return done(err);
        if (obj) {
            crearPdfsTienda(numfactu, informe, obj, (err, result) => {
                if (err) return done(err);
                done(null, result);
            });
        }
    });
}

var crearJsonTienda = function(codclien, year, numfactu, letraser, callback) {

    var facturas = [];

    if (!conector.controlDatabaseGasolinera()){
        return callback(null, facturas);
    }
    var obj = 
        {
            tien_fact: "",    
        }
   
        var sql = "SELECT";
        sql += " emp.nomempre, emp.domempre, emp.codpobla, emp.pobempre, emp.proempre, emp.cifempre,"
        sql += " f.codtipom AS codtipom,";
        sql += " f.numfactu AS numfactu,";
        sql += " f.fecfactu AS fecfactu,";
        sql += " st.letraser AS letraser,";
        sql += " (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,";
        sql += " (COALESCE(f.imporiv1,0) + COALESCE(f.imporiv2,0) + COALESCE(f.imporiv3,0)";
        sql += " + COALESCE(f.imporiv1re,0) + COALESCE(f.imporiv2re,0) + COALESCE(f.imporiv3re,0)) AS cuotas,";
        sql += " f.totalfac AS totalfac,";
        sql += " lf.codtipoa AS codtipoa,";
        sql += " lf.numalbar AS numalbar,"
        sql += " lf.numlinea AS numlinea,";
        sql += " lf.codartic AS codartic,";
        sql += " lf.nomartic AS nomartic,";
        sql += " lf.precioar AS precioar,";
        sql += " lf.cantidad AS cantidad,";
        sql += " lf.dtoline1 AS dtoline1,";
        sql += " lf.dtoline2 AS dtoline2,";
        sql += " lf.importel AS importel";
        sql += " FROM scafac AS f";
        sql += " LEFT JOIN slifac AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN stipom AS st ON st.codtipom = f.codtipom";
        sql += " LEFT JOIN ariagro.empresas AS emp ON 1=1"
        sql += " WHERE f.codclien = ? AND YEAR(f.fecfactu) = ?  AND f.numfactu = ? AND st.letraser = ?";
            // como hay gente que tiene la telefonía y la tienda en la misma base de datos lo que hacemos es
            // buscar las específicas de tipo si nos las han puesto.
            if (config.tienda.tipo_fac_tienda && config.tienda.tipo_fac_tienda.length > 0){
                sql += " AND f.codtipom IN (" + conector.sqlInString(config.tienda.tipo_fac_tienda) + ")";
            }
            sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.codtipoa, lf.numalbar, lf.numlinea;";
            sql = mysql.format(sql, [codclien, year, numfactu, letraser]);
            var con = conector.getConnectionTienda();
                con.query(sql, function (err, cab) {
                    con.end();
                    if (err) return callback(err, null);
                    obj.tien_fact = cab;
                    return callback(null, obj);
                });
    
}

//metodo para diccionario archivo json
var crearPdfsTienda = function (numfactu, informe, obj, callback) {
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
        fs.writeFile(cfg.json_dir + "\\FTIE_castelduc.json", resultado, function(err) {
            if(err) return callback(err);
            return callback(null, true);
        });

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

var fnFacturasFromDbToJson = function(facturas) {
    var fcJs = [];
    var cabJs = null;
    var linJs = null;
    var numfacAnt = 0;
    var tipomAnt = 0;
    for (var i = 0; i < facturas.length; i++) {
        var factura = facturas[i];
        if (numfacAnt != factura.numfactu || tipomAnt != factura.codtipom) {
            // es una factura nueva
            // si ya habiamos procesado una la pasamos al vector
            if (cabJs) {
                fcJs.push(cabJs);
            }
            cabJs = {
                codtipom: factura.codtipom,
                letraser: factura.letraser,
                numfactu: factura.letraser + "-" + factura.numfactu,
                numfactuSin: factura.numfactu,
                fecfactu: factura.fecfactu,
                bases: factura.bases,
                cuotas: factura.cuotas,
                totalfac: factura.totalfac,
                lineas: []
            };
            numfacAnt = factura.numfactu;
            tipomAnt = factura.codtipom;
        }
        // siempre se procesa una linea
        if (factura.numlinea) {
            linJs = {
                codtipoa: factura.codtipoa,
                numalbar: factura.numalbar,
                numlinea: factura.numlinea,
                codartic: factura.codartic,
                nomartic: factura.nomartic,
                precioar: factura.precioar,
                cantidad: factura.cantidad,
                dtoline1: factura.dtoline1,
                dtoline2: factura.dtoline2,
                importel: factura.importel
            };
            cabJs.lineas.push(linJs);
        }
    }
    if (cabJs) {
        fcJs.push(cabJs);
    }
    return fcJs;
}
