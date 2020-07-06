// AriAgroMovApi
console.log("AriAgroApi --------");
// Cargar los módulos básicos
var express = require('express');
var bodyParser = require("body-parser"); // proceso de los cuerpos de mensaje
var pjson = require('./package.json'); // read vrs and more information
var cors = require('cors'); // cross origin resopurce sharing management

// modulos encargados de las rutas
var campos_router = require('./lib/campos/campos_controller');
var anticipos_liquidaciones_router = require('./lib/anticipos-liquidaciones/anticipos_liquidaciones_controller');
var empresas_router = require('./lib/empresas/empresas_controller');
var campanyas_router = require('./lib/campanyas/campanyas_controller');
var facturas_router = require('./lib/facturas/facturas_controller');

// controladores para rutas de push
var version_router = require('./lib/version/version_controller');
var administradores_router = require('./lib/administradores/administradores_controller');
var usupush_router = require('./lib/usupush/usupush_controller');
var parametros_router = require('./lib/parametros/parametros_controller');
var mensajes_router = require('./lib/mensajes/mensajes_controller');
var uploader_router = require('./lib/uploader/uploader_controller');
var recursos_router = require('./lib/recursos/recursos_controller');
var enlaces_router = require('./lib/enlaces/enlaces_controller');
var s2_router = require('./lib/s2/s2_controller');
// express
var app = express();

// CORS management
app.options('*', cors()); // include before other routes
app.use(cors());

//importacion de configuracion env
var conf = require('dotenv');
conf.config();

// leyendo la configuracion 
//var config = require('./config/config.json');

// activar el procesador de los cuerpos de mensajes

//app.use(bodyParser ({limit: '50mb'})); 
//app.use (bodyParser.urlencoded ({limit: '50mb'})); 


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '100mb'}));


// servidor html estático
app.use(express.static(__dirname+"/public"));
app.use('/mobile', express.static(__dirname+"/www"));

//-------------------------------------------------------------
// RUTAS
//-------------------------------------------------------------

var router = express.Router();

// paso común de cualquier ruta
router.use(function(req, res, next){
	// aquí va el código común
	// ----------------------------
	// continúa la ejecución
	next();
});

// ruta raiz
router.get('/', function (req, res){
    var str = "AriAgroApi VRS: " + pjson.version; //
    res.end(str);
});

//---------- Rutas relacionadas con los campos
app.use('/api/campos', campos_router);
//---------- Rutas relacionadas con los anticipos y las liquidaciones
app.use('/api/anticipos-liquidaciones', anticipos_liquidaciones_router);
//---------- Rutas relacionadas con empresas
app.use('/api/empresas', empresas_router);
//---------- Rutas relacionadas con campanyas
app.use('/api/campanyas', campanyas_router);
//---------- Rutas relacionadas con facturas
app.use('/api/facturas', facturas_router);

//---------- Rutas relacionadas con version
app.use('/api/version', version_router);
//---------- Rutas relacionadas con administradores
app.use('/api/administradores', administradores_router);
//---------- Rutas relacionadas con usupush
app.use('/api/usupush', usupush_router);
//---------- Rutas relacionadas con parametros
app.use('/api/parametros', parametros_router);
//---------- Rutas relacionadas con mensajes
app.use('/api/mensajes', mensajes_router);
//---------- Rutas relacionadas con el cargador.
app.use('/api/uploader', uploader_router);
//---------- Rutas relacionadas con recursos
app.use('/api/recursos', recursos_router);
//---------- Rutas relacionadas con enlaces
app.use('/api/enlaces', enlaces_router);

//---------- Rutas relacionadas con solicitud de documentos
app.use('/api/s2', s2_router);


// Registrar rutas base
app.use('/api', router);

// START SERVER
//==========================
app.listen(process.env.API_PORT);
console.log("AriAgroApi VRS: ", pjson.version)
console.log("AriAgroApi en puerto: ", process.env.API_PORT);