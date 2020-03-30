
var fs = require("fs");
//var cfg = require('../../config/config.json');
var nodemailer = require('nodemailer');




function recuperaConfig() {
    var cfg = {
        apiPort: process.env.API_PORT,
        apiHost: process.env.API_HOST,
        ficheros: process.env.FICHEROS,
        reports_dir: process.env.REPORTS_DIR,
        clasif_dir: process.env.CLASIF_DIR,
        json_dir: process.env.JSON_DIR,
        smtpConfig: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        },
        destinatario: process.env.EMAIL_DESTINATARIO
    }
    return cfg;
}

// crearCorreosAEnviar
module.exports.crearCorreosAEnviar = (numfactu, email, ruta, coop, codtipom, callback) => {
    var cfg = recuperaConfig();
    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
    var tip = codtipom;
    if (codtipom == 'anticipo') { 
        tip = "Anticipo";
    }
    if (codtipom == "liquidacion") {
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