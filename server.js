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

// Registrar rutas base
app.use('/api', router);

// START SERVER
//==========================
app.listen(config.apiPort);
console.log("AriAgroApi en puerto: ", config.apiPort);