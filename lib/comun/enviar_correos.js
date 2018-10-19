
var fs = require("fs");
var cfg = require('../../config/config.json');
var nodemailer = require('nodemailer');


// crearCorreosAEnviar
module.exports.crearCorreosAEnviar = (numfactu, email, ruta, coop, codtipom,callback) => {
    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
    var tip = codtipom;
    if (codtipom == "FAA") { 
        tip = "Anticipo";
    }
    if (codtipom == "FAL") {
        tip = "Liquidación";
    }
    if (codtipom == "FAV") {
        tip = "Tienda";
    }
    correo.asunto = '['+coop+'] Factura'
    correo.texto = "Estimado socio/socia esta es la factura numero  "+ numfactu +" de "+tip+" solicitada.\n Reciba un cordial saludo";

    // 2- Montamos el transporte del correo basado en la
    // configuración.
    var transporter = nodemailer.createTransport(cfg.smtpConfig);
    var emisor = cfg.smtpConfig.auth.user;
    
    var mailOptions = {
        from: emisor,
        to: email,
        subject:  correo.asunto,
        text: correo.texto
    };

    var  attach = {
        filename: ruta.replace(/^.*[\\\/]/, ''),
        path: ruta
    };
    mailOptions.attachments = attach;


    // 3- Enviar el correo propiamente dicho
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            return callback(err);
        }
        //borramos el pdf que hemos enviado
        fs.unlink(cfg.clasif_dir + "\\" + numfactu + ".pdf", (err) => {
            return callback(err);
            console.log('archivo borrado con exito');
          });
        callback(null, true);
    });

}