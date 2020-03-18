var express = require('express');
var router = express.Router();
var anticiposLiquidacionesMysql = require('./anticipos_liquidaciones_mysql');

router.get('/socio', function(req, res) {
    // confirmar que se han recibido correctamente los parámetros
    // codsocio y campanya
    // password: password asignada
    query = req.query;
    if (query.codsocio && query.campanya) {
        anticiposLiquidacionesMysql.getAnticiposLiquidacionesSocio(query.codsocio, query.campanya, function(err, campos) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (campos) {
                return res.json(campos)
            } else {
                return res.status(404).send('Campo no encontrado');
            }
        });
    } else {
        return res.status(400).send('Formato de la petición incorrecto');
    }
});

//Envio de pdf por correo
// PostEnviarCorreos
router.post('/preparar-correo', function (req, res) {
    var numfactu = req.body.numfactu;
    var campanya = req.body.campanya;
    var informe = req.body.informe;
    var codtipom = req.body.codtipom;
    var servidor = req.body.servidor;
    anticiposLiquidacionesMysql.postPrepararCorreos(null, numfactu, campanya, informe, codtipom, servidor, function (err, result) {
         if (err) return res.status(500).send(err.message);
         res.json(result);
     });
 });

 //Envio de pdf por correo con parametro año
// PostEnviarCorreos
router.post('/preparar-correo/nuevo', function (req, res) {
    var numfactu = req.body.numfactu;
    var campanya = req.body.campanya;
    var informe = req.body.informe;
    var codtipom = req.body.codtipom;
    var servidor = req.body.servidor;
    var fecfactu = req.body.fecfactu;
    var paramCentral = req.body.paramCentral;
    anticiposLiquidacionesMysql.postPrepararCorreosNuevo(fecfactu, paramCentral, numfactu, campanya, informe, codtipom, servidor, function (err, result) {
         if (err) return res.status(500).send(err.message);
         res.json(result);
     });
 });

 router.post('/enviar/correo/ant-liq', function (req, res) {
    var numfactu = req.body.numfactu;
    var email = req.body.email;
    var ruta = req.body.ruta;
    var coop = req.body.coop;
    var codtipom = req.body.codtipom;
    anticiposLiquidacionesMysql.postEnviarCorreos(numfactu, email, ruta, coop, codtipom,function (err, result) {
         if (err) return res.status(500).send(err.message);
         res.json(result);
     });
 });
 


// Exports
module.exports = router;
