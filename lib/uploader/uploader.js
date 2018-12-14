// Se encarga de los mensajes para carga de ficheros
//
// manejo de ficheros
var fs = require('fs');
var formidable = require('formidable');
//var cfg = require('../../config/config.json');

//importacion de configuracion env
var conf = require('dotenv');
conf.config();


function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

module.exports.uploadTerminalFile = function(directory) {
    var mfun = function(req, res) {
        var idPremio = req.params.premio_id;
        //console.log("IDPREMIO:", idPremio)
        if (!isFormData(req)) {
            res.statusCode = 404;
            res.end('Petición incorrecta: se esperaba multipart/form-data');
            return;
        }

        var form = new formidable.IncomingForm();
        //form.on('progress', function(bytesReceived, bytesExpected) {
        //    var percent = Math.floor(bytesReceived / bytesExpected * 100);
        //    console.log(percent);
        //});

        form.parse(req, function(err, fields, files) {
            //console.log(fields);
            //console.log(files);
            fs.readFile(files.uploadImage.path, function(err, data) {
                var oldPath = files.uploadImage.path;
                var newPath = process.env.ficheros + files.uploadImage.name;
                fs.rename(files.uploadImage.path, newPath, function(err) {
                    if (err) throw err;
                });
            });
            var data = {};
            data.success = 1
            data.FileName = files.uploadImage.name;
            res.json(data);
        });
    };
    return mfun;
}