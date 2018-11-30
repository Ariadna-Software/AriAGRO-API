
var fs = require("fs");
var cfg = require('../../config/config.json');
var nodemailer = require('nodemailer');


// crearCorreosAEnviar
module.exports.crearCorreosAEnviar = (numfactu, email, ruta, coop, codtipom, callback) => {
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

    if(!tip) {
        correo.asunto = '['+coop+'] Clasificación'
        correo.texto = "Estimado socio/socia esta es la clasificación solicitada del albaran "+ numfactu +". \n Reciba un cordial saludo";
    
    } else {
        correo.asunto = '['+coop+'] Factura'
        correo.texto = "Estimado socio/socia esta es la factura numero  "+ numfactu +" de "+tip+" solicitada.\n Reciba un cordial saludo";
    
    }
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
        filename: numfactu + '.pdf',
        contentType: 'application/pdf',
        content: new Buffer(ruta, "utf-8")
    };
    mailOptions.attachments = attach;


    // 3- Enviar el correo propiamente dicho
    transporter.sendMail(mailOptions, function(err, info){
        if (err){
            return callback(err);
        }
        
        callback(null, true);
    });

}