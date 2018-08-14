webpackJsonp([24],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AriagroDataProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AriagroDataProvider = /** @class */ (function () {
    function AriagroDataProvider(http) {
        this.http = http;
    }
    AriagroDataProvider.prototype.getParametrosCentral = function (numCooperativa) {
        var url = 'http://ariagro.myariadna.com:9901/api/parametros/' + numCooperativa;
        return this.http.get(url);
    };
    AriagroDataProvider.prototype.getParametros = function (url) {
        return this.http.get(url + '/api/parametros/0');
    };
    AriagroDataProvider.prototype.login = function (url, login, password) {
        return this.http.get(url + '/api/usupush/login', {
            params: {
                login: login,
                password: password
            }
        });
    };
    AriagroDataProvider.prototype.getCampanyas = function (url) {
        return this.http.get(url + '/api/campanyas');
    };
    AriagroDataProvider.prototype.getCampos = function (url, socio, campanya) {
        return this.http.get(url + '/api/campos/socio', {
            params: {
                codsocio: socio,
                campanya: campanya
            }
        });
    };
    AriagroDataProvider.prototype.getAnticipos = function (url, socio, campanya) {
        return this.http.get(url + '/api/anticipos-liquidaciones/socio', {
            params: {
                codsocio: socio,
                campanya: campanya
            }
        });
    };
    AriagroDataProvider.prototype.getFacturasTienda = function (url, codclien, year) {
        return this.http.get(url + '/api/facturas/tienda/' + codclien + '/' + year);
    };
    AriagroDataProvider.prototype.getFacturasTelefonia = function (url, codclien, year) {
        return this.http.get(url + '/api/facturas/telefonia/' + codclien + '/' + year);
    };
    AriagroDataProvider.prototype.getFacturasGasolinera = function (url, codclien, year) {
        return this.http.get(url + '/api/facturas/gasolinera/' + codclien + '/' + year);
    };
    AriagroDataProvider.prototype.getFacturasTratamientos = function (url, codclien, year, codsocio, campanya) {
        return this.http.get(url + '/api/facturas/tratamientos/' + codclien + '/' + year + '/' + codsocio + '/' + campanya);
    };
    AriagroDataProvider.prototype.getMensajesUsuario = function (url, usuPush) {
        return this.http.get(url + '/api/mensajes/usuario/' + usuPush);
    };
    AriagroDataProvider.prototype.getMensajeHttp = function (url, mensajeId) {
        return this.http.get(url + '/api/mensajes/' + mensajeId);
    };
    AriagroDataProvider.prototype.getCampoClasificacion = function (url, codcampo, campanya) {
        return this.http.get(url + '/api/campos/buscar/clasificacion/' + codcampo + '/' + campanya);
    };
    AriagroDataProvider.prototype.getAlbaranClasificacion = function (url, numalbar, campanya) {
        return this.http.get(url + '/api/campos/buscar/clasificacion/albaran/' + numalbar + '/' + campanya);
    };
    AriagroDataProvider.prototype.putMensajeUsuario = function (url, usuarioPushId, mensajeId, fecha) {
        var data = {
            usuarioPushId: usuarioPushId,
            mensajeId: mensajeId,
            fecha: fecha
        };
        return this.http.put(url + '/api/mensajes/usuario/' + usuarioPushId, data);
    };
    AriagroDataProvider.prototype.putUsuario = function (url, id, usuario) {
        var data = {
            usuarioPush: usuario
        };
        return this.http.put(url + '/api/usupush/' + id, data);
    };
    AriagroDataProvider.prototype.postCorreo = function (url, correo) {
        var data = {
            correo: correo
        };
        return this.http.post(url + '/api/mensajes/correo', data);
    };
    AriagroDataProvider.prototype.prepararCorreoClasif = function (url, numalbar) {
        var data = {
            numalbar: numalbar
        };
        return this.http.post(url + '/api/mensajes/preparar-correo/clasif', data);
    };
    AriagroDataProvider.prototype.enviarCorreoClasif = function (url, numalbar, email, ruta) {
        var data = {
            numalbar: numalbar,
            email: email,
            ruta: ruta
        };
        return this.http.post(url + '/api/mensajes/enviar/correo/clasif', data);
    };
    AriagroDataProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], AriagroDataProvider);
    return AriagroDataProvider;
}());

//# sourceMappingURL=ariagro-data.js.map

/***/ }),

/***/ 113:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 113;

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/anticipos-detalle/anticipos-detalle.module": [
		308,
		23
	],
	"../pages/anticipos/anticipos.module": [
		285,
		5
	],
	"../pages/campanyas/campanyas.module": [
		287,
		22
	],
	"../pages/campos/campos.module": [
		286,
		21
	],
	"../pages/datos/datos.module": [
		290,
		20
	],
	"../pages/entradas/entradas.module": [
		288,
		4
	],
	"../pages/facturas-gasolinera-detalle/facturas-gasolinera-detalle.module": [
		289,
		19
	],
	"../pages/facturas-gasolinera/facturas-gasolinera.module": [
		291,
		18
	],
	"../pages/facturas-telefonia-detalle/facturas-telefonia-detalle.module": [
		293,
		17
	],
	"../pages/facturas-telefonia/facturas-telefonia.module": [
		292,
		16
	],
	"../pages/facturas-tienda-detalle/facturas-tienda-detalle.module": [
		306,
		15
	],
	"../pages/facturas-tienda/facturas-tienda.module": [
		294,
		14
	],
	"../pages/facturas-tratamientos-detalle/facturas-tratamientos-detalle.module": [
		295,
		13
	],
	"../pages/facturas-tratamientos/facturas-tratamientos.module": [
		296,
		12
	],
	"../pages/facturas/facturas.module": [
		297,
		3
	],
	"../pages/home/home.module": [
		298,
		2
	],
	"../pages/login/login.module": [
		299,
		11
	],
	"../pages/mensajes-detalle/mensajes-detalle.module": [
		300,
		1
	],
	"../pages/mensajes-enviar/mensajes-enviar.module": [
		301,
		10
	],
	"../pages/mensajes/mensajes.module": [
		302,
		0
	],
	"../pages/modal-calidades-albaran/modal-calidades-albaran.module": [
		303,
		9
	],
	"../pages/modal-calidades-campo/modal-calidades-campo.module": [
		304,
		8
	],
	"../pages/modal-datos-cambiar/modal-datos-cambiar.module": [
		307,
		7
	],
	"../pages/parametros/parametros.module": [
		305,
		6
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 154;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocalDataProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_storage__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LocalDataProvider = /** @class */ (function () {
    function LocalDataProvider(storage) {
        this.storage = storage;
    }
    LocalDataProvider.prototype.getSettings = function () {
        return this.storage.get('ariagroApp');
    };
    LocalDataProvider.prototype.saveSettings = function (settings) {
        var data = JSON.stringify(settings);
        this.storage.set('ariagroApp', data);
    };
    LocalDataProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__ionic_storage__["b" /* Storage */]])
    ], LocalDataProvider);
    return LocalDataProvider;
}());

//# sourceMappingURL=local-data.js.map

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(224);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_local_data_local_data__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_onesignal__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_app_version__ = __webpack_require__(200);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/anticipos/anticipos.module#CamposPageModule', name: 'AnticiposPage', segment: 'anticipos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/campos/campos.module#CamposPageModule', name: 'CamposPage', segment: 'campos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/campanyas/campanyas.module#LoginPageModule', name: 'CampanyasPage', segment: 'campanyas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/entradas/entradas.module#EntradasPageModule', name: 'EntradasPage', segment: 'entradas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-gasolinera-detalle/facturas-gasolinera-detalle.module#FacturasGasolineraDetallePageModule', name: 'FacturasGasolineraDetallePage', segment: 'facturas-gasolinera-detalle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/datos/datos.module#LoginPageModule', name: 'DatosPage', segment: 'datos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-gasolinera/facturas-gasolinera.module#FacturasGasolineraPageModule', name: 'FacturasGasolineraPage', segment: 'facturas-gasolinera', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-telefonia/facturas-telefonia.module#FacturasTelefoniaPageModule', name: 'FacturasTelefoniaPage', segment: 'facturas-telefonia', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-telefonia-detalle/facturas-telefonia-detalle.module#FacturasTelefoniaDetallePageModule', name: 'FacturasTelefoniaDetallePage', segment: 'facturas-telefonia-detalle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-tienda/facturas-tienda.module#FacturasTiendaPageModule', name: 'FacturasTiendaPage', segment: 'facturas-tienda', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-tratamientos-detalle/facturas-tratamientos-detalle.module#FacturasTratamientosDetallePageModule', name: 'FacturasTratamientosDetallePage', segment: 'facturas-tratamientos-detalle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-tratamientos/facturas-tratamientos.module#FacturasTratamientosPageModule', name: 'FacturasTratamientosPage', segment: 'facturas-tratamientos', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas/facturas.module#FacturasPageModule', name: 'FacturasPage', segment: 'facturas', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/home/home.module#HomePageModule', name: 'HomePage', segment: 'home', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/mensajes-detalle/mensajes-detalle.module#MensajesDetallePageModule', name: 'MensajesDetallePage', segment: 'mensajes-detalle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/mensajes-enviar/mensajes-enviar.module#MensajesEnviarPageModule', name: 'MensajesEnviarPage', segment: 'mensajes-enviar', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/mensajes/mensajes.module#MensajesPageModule', name: 'MensajesPage', segment: 'mensajes', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/modal-calidades-albaran/modal-calidades-albaran.module#ModalCalidadesAlbaranPageModule', name: 'ModalCalidadesAlbaranPage', segment: 'modal-calidades-albaran', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/modal-calidades-campo/modal-calidades-campo.module#ModalCalidadesCampoPageModule', name: 'ModalCalidadesCampoPage', segment: 'modal-calidades-campo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/parametros/parametros.module#ParametrosPageModule', name: 'ParametrosPage', segment: 'parametros', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/facturas-tienda-detalle/facturas-tienda-detalle.module#FacturasTiendaDetallePageModule', name: 'FacturasTiendaDetallePage', segment: 'facturas-tienda-detalle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/modal-datos-cambiar/modal-datos-cambiar.module#ModalDatosCambiarPageModule', name: 'ModalDatosCambiarPage', segment: 'modal-datos-cambiar', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/anticipos-detalle/anticipos-detalle.module#EntradasPageModule', name: 'AnticiposDetallePage', segment: 'anticipos-detalle', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_8__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */],
                __WEBPACK_IMPORTED_MODULE_9__providers_local_data_local_data__["a" /* LocalDataProvider */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_app_version__["a" /* AppVersion */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__locales_locales__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, ariagroData) {
        this.rootPage = 'HomePage';
        this.settings = {};
        this.password = "";
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            // Setting locales for the entire app
            var loc = new __WEBPACK_IMPORTED_MODULE_4__locales_locales__["a" /* Locales */]();
            loc.NumeralLocales();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"c:\PROYECTOS\AriagroApp\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"c:\PROYECTOS\AriagroApp\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_5__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Locales; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_numeral__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_numeral___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_numeral__);

var Locales = /** @class */ (function () {
    function Locales() {
    }
    Locales.prototype.NumeralLocales = function () {
        // load a locale
        __WEBPACK_IMPORTED_MODULE_0_numeral__["register"]('locale', 'es', {
            delimiters: {
                thousands: '.',
                decimal: ','
            },
            abbreviations: {
                thousand: 'k',
                million: 'm',
                billion: 'b',
                trillion: 't'
            },
            ordinal: function (number) {
                return number === 1 ? 'er' : 'ème';
            },
            currency: {
                symbol: '€'
            }
        });
        // switch between locales
        __WEBPACK_IMPORTED_MODULE_0_numeral__["locale"]('es');
    };
    return Locales;
}());

//# sourceMappingURL=locales.js.map

/***/ })

},[203]);
//# sourceMappingURL=main.js.map