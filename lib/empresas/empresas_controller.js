var express = require('express');
var router = express.Router();
var empresasMysql = require('./empresas_mysql');

router.get('/', function(req, res) {
    // No hay parámetros, la llamada es directa.
    empresasMysql.getEmpresa(function(err, empresa) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (empresa) {
            return res.json(empresa)
        } else {
            return res.status(404).send('Empresa no encontrado');
        }
    });

});

// Exports
module.exports = router;
