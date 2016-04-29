// AriGesMovApi
console.log("AriGesMovApi --------");
// Cargar los módulos básicos
var express = require('express');
var bodyParser = require("body-parser"); // proceso de los cuerpos de mensaje
var pjson = require('./package.json'); // read vrs and more information
var cors = require('cors'); // cross origin resopurce sharing management

// modulos encargados de las rutas
var usuario_router = require('./lib/usuario/usuario_controller');
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
// express
var app = express();

// CORS management
app.options('*', cors()); // include before other routes
app.use(cors());


// leyendo la configuracion 
var config = require('./config/config.json');

// activar el procesador de los cuerpos de mensajes
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());


// servidor html estático
app.use(express.static(__dirname+"/public"));

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

//---------- Rutas relacionadas con los usuarios
app.use('/api/usuarios', usuario_router);
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



// Registrar rutas base
app.use('/api', router);

// START SERVER
//==========================
app.listen(config.apiPort);
console.log("AriAgroApi en puerto: ", config.apiPort);