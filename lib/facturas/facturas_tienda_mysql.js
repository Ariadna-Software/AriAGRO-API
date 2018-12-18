var mysql = require('mysql');
var conector = require('../comun/conector_mysql');
//var config = require('../../config/mysql_config.json');
//var cfg = require('../../config/config.json');
var Stimulsoft = require('stimulsoft-reports-js');
var fs = require("fs");
var moment = require('moment');


//importacion de configuración .env
var conf = require('dotenv');
conf.config();


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
    var array = [];
    if(process.env.tiendatipo_fac_tienda){
        array = JSON.parse(process.env.tiendatipo_fac_tienda);//convertimos el objeto en json
    }
    
    if (process.env.tiendatipo_fac_tienda && array.length > 0){
        sql += " AND f.codtipom IN (" + conector.sqlInString(array) + ")";
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

    if (!conector.controlDatabaseTienda()){
        // no hay tienda, devuelve lista de facturas vacía siempre
        return callback(null, facturas);
    }
    var obj = 
        {
            tien_fact: "",    
        }
   
        var sql = "SELECT";
        sql += " emp.nomempre, emp.domempre, emp.codpobla, emp.pobempre, emp.proempre, emp.cifempre,emp.wwwempre,emp.codpobla,emp.telempre,"
        sql += " f.codtipom AS codtipom,";
        sql += " f.numfactu AS numfactu,";
        sql += " f.fecfactu AS fecfactu,";
        sql += " RIGHT(CONCAT('000000',f.codclien),6) AS codclien,"
        sql += " f.nomclien AS nomclien,";
        sql += " f.domclien AS domclien,";
        sql += " f.codpobla AS codpobla,";
        sql += " f.pobclien AS pobclien,";
        sql += " f.proclien AS proclien,"
        sql += " f.nifclien AS nifclien,", 
        sql += " st.letraser AS letraser,";
        sql += " (COALESCE(f.baseimp1,0) + COALESCE(f.baseimp2,0) + COALESCE(f.baseimp3,0)) AS bases,";
        sql += " (COALESCE(f.imporiv1,0) + COALESCE(f.imporiv2,0) + COALESCE(f.imporiv3,0)";
        sql += " + COALESCE(f.imporiv1re,0) + COALESCE(f.imporiv2re,0) + COALESCE(f.imporiv3re,0)) AS cuotas,";
        sql += " f.totalfac AS totalfac,";
        sql += " lf.codtipoa AS codtipoa,";
        sql += " f1.numalbar AS numalbar,";
        sql += " f1.fechaalb AS fechaalb,";
        sql += " f1.codtraba AS codtraba,";
        sql += " tra.nomtraba AS nomtraba,";
        sql += " COALESCE(f1.ManipuladorNumCarnet, 'zero') AS manipuladorNumCarnet,";
        sql += " f1.ManipuladorFecCaducidad AS manipuladorFecCad,";
        sql += " f1.ManipuladorNombre AS manipuladorNombre,";
        sql += " f1.TipoCarnet AS tipoCarnet,";
        sql += " lf.numlinea AS numlinea,";
        sql += " lf.codartic AS codartic,";
        sql += " lf.nomartic AS nomartic,";
        sql += " COALESCE(sar.numserie, 'zero') AS numserie,";
        sql += " sar.fecvigen AS fecvigen,";
        sql += " lf.precioar AS precioar,";
        sql += " lf.cantidad AS cantidad,";
        sql += " lf.dtoline1 AS dtoline1,";
        sql += " lf.dtoline2 AS dtoline2,";
        sql += " lf.importel AS importel,";
        sql += " lot.numlote AS numlote,"
        sql += " fp.nomforpa AS nomforpa,";
        sql += " RIGHT(CONCAT('000',fp.codforpa),3) AS codforpa,";
       
        sql += " ven.fecefect AS fecevenc,";
        sql += " ven.impefect AS impefect,";

        sql += " f.brutofac AS brutofac,";
        sql += " f.dtoppago AS dtoppago,";
        sql += " f.impdtopp AS impdtopp,";
        sql += " f.totalfac AS totalfac,";
        sql += " f.dtognral AS dtognral,";
        sql += " f.impdtogr AS impdtogr,";
        sql += " COALESCE(f.baseimp1, 0) AS baseimp1,";
        sql += " COALESCE(f.baseimp2, 0) AS baseimp2,";
        sql += " COALESCE(f.baseimp3, 0) AS baseimp3,";
        sql += " COALESCE(f.porciva1, 0) AS porciva1,";
        sql += " COALESCE(f.porciva2, 0) AS porciva2,";
        sql += " COALESCE(f.porciva3, 0) AS porciva3,";
        sql += " COALESCE(f.imporiv1, 0) AS imporiv1,";
        sql += " COALESCE(f.imporiv2, 0) AS imporiv2,";
        sql += " COALESCE(f.imporiv3, 0) AS imporiv3";
          

        sql += " FROM scafac AS f";
        sql += " LEFT JOIN scafac1 AS f1 ON (f1.codtipom = f.codtipom AND f1.numfactu = f.numfactu AND f1.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN slifac AS lf ON (lf.codtipom = f.codtipom AND lf.numfactu = f.numfactu AND lf.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN sartic AS sar ON sar.codartic = lf.codartic";
        sql += " LEFT JOIN slifaclotes AS lot ON (lot.codtipom = lf.codtipom AND lot.numfactu = lf.numfactu AND lot.fecfactu = lf.fecfactu AND lot.codtipoa = lf.codtipoa AND lot.numalbar = lf.numalbar AND lot.numlinea = lf.numlinea)";
        sql += " LEFT JOIN stipom AS st ON st.codtipom = f.codtipom";
        sql += " LEFT JOIN sforpa AS fp ON fp.codforpa = f.codforpa";
        sql += " LEFT JOIN svenci AS ven ON (ven.codtipom = f.codtipom AND ven.numfactu = f.numfactu AND ven.fecfactu = f.fecfactu)";
        sql += " LEFT JOIN straba AS tra ON tra.codtraba = f1.codtraba";
        sql += " LEFT JOIN ariagro.empresas AS emp ON 1=1"
        sql += " WHERE f.codclien = ? AND YEAR(f.fecfactu) = ?  AND f.numfactu = ? AND st.letraser = ?";
            // como hay gente que tiene la telefonía y la tienda en la misma base de datos lo que hacemos es
            // buscar las específicas de tipo si nos las han puesto.
            var array = [];
            if(process.env.tiendatipo_fac_tienda){
                array = JSON.parse(process.env.tiendatipo_fac_tienda);//convertimos el objeto en json
            }
            if (process.env.tiendatipo_fac_tienda && array.length > 0){
                sql += " AND f.codtipom IN (" + conector.sqlInString(array) + ")";
            }
            sql += " ORDER BY f.fecfactu DESC, f.codtipom, f.numfactu, lf.codtipoa, lf.numalbar, lf.numlinea;";
            sql = mysql.format(sql, [codclien, year, numfactu, letraser]);
            var con = conector.getConnectionTienda();
                con.query(sql, function (err, cab) {
                    con.end();
                    if (err) return callback(err, null);
                    for(var i = 0; i < cab.length; i++) {
                        cab[i].fecfactu = moment(cab[i].fecfactu).format('DD/MM/YYYY');
                        cab[i].fechaalb = moment(cab[i].fechaalb).format('DD/MM/YYYY');
                        cab[i].manipuladorFecCad = moment(cab[i].manipuladorFecCad).format('DD/MM/YYYY');
                        cab[i].fecvigen = moment(cab[i].fecvigen).format('DD/MM/YYYY');
                        cab[i].fecevenc = moment(cab[i].fecevenc).format('DD/MM/YYYY');
                        cab[i].codforpa =  cab[i].codforpa.toString();
                        cab[i].codclien = cab[i].codclien.toString();
                    }
                    obj.tien_fact = cab;
                    return callback(null, obj);
                });
    
}

//metodo para diccionario archivo json
var crearPdfsTienda = function (numfactu, informe, obj, callback) {
    Stimulsoft.Base.StiLicense.key = process.env.sti_key;
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
       
        var file = process.env.reports_dir + "\\" + informe;
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
        /*fs.writeFile(process.env.json_dir + "\\FTIE_castelduc.json", resultado, function(err) {
            if(err) return callback(err);
           
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

            /*fs.writeFile(process.env.clasif_dir + "\\" + numfactu + ".pdf", buffer, function(err){
                if(err) return callback(err, null);
            });*/
            callback(null, data);
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
