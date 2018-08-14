webpackJsonp([9],{

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalCalidadesAlbaranPageModule", function() { return ModalCalidadesAlbaranPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modal_calidades_albaran__ = __webpack_require__(453);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ModalCalidadesAlbaranPageModule = /** @class */ (function () {
    function ModalCalidadesAlbaranPageModule() {
    }
    ModalCalidadesAlbaranPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__modal_calidades_albaran__["a" /* ModalCalidadesAlbaranPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__modal_calidades_albaran__["a" /* ModalCalidadesAlbaranPage */]),
            ],
        })
    ], ModalCalidadesAlbaranPageModule);
    return ModalCalidadesAlbaranPageModule;
}());

//# sourceMappingURL=modal-calidades-albaran.module.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalCalidadesAlbaranPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_local_data_local_data__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_numeral__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_numeral___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_numeral__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ModalCalidadesAlbaranPage = /** @class */ (function () {
    function ModalCalidadesAlbaranPage(navCtrl, navParams, viewCtrl, localData, alertCrtl, loadingCtrl, ariagroData) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.localData = localData;
        this.alertCrtl = alertCrtl;
        this.loadingCtrl = loadingCtrl;
        this.ariagroData = ariagroData;
        this.settings = {};
        this.campanya = {};
        this.user = {};
        this.entrada = {};
        this.calidades = [];
        this.incidencias = [];
    }
    ModalCalidadesAlbaranPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                _this.user = _this.settings.user;
                _this.campanya = _this.settings.campanya;
                _this.entrada = _this.navParams.get('entrada');
                _this.loadCalidades();
            }
            else {
                _this.navCtrl.setRoot('ParametrosPage');
            }
        });
    };
    ModalCalidadesAlbaranPage.prototype.loadCalidades = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: 'Buscando clasificacion...' });
        loading.present();
        this.ariagroData.getAlbaranClasificacion(this.settings.parametros.url, this.entrada.numalbar, this.campanya.ariagro)
            .subscribe(function (data) {
            loading.dismiss();
            _this.calidades = _this.prepareData(data[0]);
            _this.incidencias = _this.prepareIncidencias(data[1]);
        }, function (error) {
            loading.dismiss();
            _this.showAlert("ERROR", JSON.stringify(error, null, 4));
        });
    };
    ModalCalidadesAlbaranPage.prototype.prepareData = function (calidades) {
        var contador = 1;
        calidades.forEach(function (a) {
            if (a.kilos != null) {
                a.contador = contador++;
                a.kilos = __WEBPACK_IMPORTED_MODULE_4_numeral__(a.kilos).format('0,0');
            }
        });
        return calidades;
    };
    ModalCalidadesAlbaranPage.prototype.prepareIncidencias = function (incidencias) {
        var contador = 1;
        incidencias.forEach(function (a) {
            a.contador = contador++;
        });
        return incidencias;
    };
    ModalCalidadesAlbaranPage.prototype.comprobarCorreo = function () {
        var _this = this;
        var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        //Se muestra un texto a modo de ejemplo, luego va a ser un icono
        if (this.correo) {
            this.settings.user.email = this.correo;
        }
        if (emailRegex.test(this.settings.user.email)) {
            this.loading = this.loadingCtrl.create({ content: 'Enviando correo...' });
            this.loading.present();
            this.ariagroData.prepararCorreoClasif(this.settings.parametros.url, this.entrada.numalbar)
                .subscribe(function (data) {
                _this.enviarCorreo(data);
            }, function (error) {
                _this.showAlert("ERROR", JSON.stringify(error, null, 4));
            });
        }
        else {
            this.pedirCorreo();
        }
    };
    ModalCalidadesAlbaranPage.prototype.enviarCorreo = function (ruta) {
        var _this = this;
        this.ariagroData.enviarCorreoClasif(this.settings.parametros.url, this.entrada.numalbar, this.settings.user.email, ruta)
            .subscribe(function (data) {
            _this.loading.dismiss();
            _this.showAlert("", JSON.stringify(data, null, 4));
        }, function (error) {
            _this.showAlert("ERROR", JSON.stringify(error, null, 4));
        });
    };
    ModalCalidadesAlbaranPage.prototype.pedirCorreo = function () {
        var _this = this;
        var alert = this.alertCrtl.create({
            title: 'Correo no configurado o incorrecto, introduzca un correo',
            inputs: [
                {
                    name: 'Correo',
                    placeholder: 'ejemplo@servidor.com'
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Aceptar',
                    handler: function (data) {
                        _this.correo = data.Correo;
                        _this.comprobarCorreo();
                    }
                }
            ]
        });
        alert.present();
    };
    ModalCalidadesAlbaranPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    };
    ModalCalidadesAlbaranPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalCalidadesAlbaranPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-modal-calidades-albaran',template:/*ion-inline-start:"c:\PROYECTOS\AriagroApp\src\pages\modal-calidades-albaran\modal-calidades-albaran.html"*/'<ion-header>\n\n\n\n    <ion-navbar>\n\n        <ion-buttons end>\n\n            <button ion-button icon-only (click)="dismiss()">\n\n              <ion-icon class="myGreen" ios="ios-arrow-back" md="md-arrow-back"></ion-icon>\n\n            </button>\n\n          </ion-buttons>\n\n      <ion-title>ALBARAN {{entrada.numalbar}}</ion-title>\n\n    </ion-navbar>\n\n  \n\n  </ion-header>\n\n  \n\n  \n\n  <ion-content padding>\n\n      <ion-list>\n\n          <ion-item text-wrap no-lines class="greenHeader">\n\n            Fecha: {{entrada.fecalbar}}\n\n            <br> {{entrada.kilosnet}} Kg. {{entrada.numcajon}} Cajones\n\n          </ion-item>\n\n      </ion-list>\n\n  \n\n      <ion-list>\n\n          <ion-item no-lines *ngIf="calidades.length > 0 " >         \n\n            <ion-grid style=" border: 1px solid grey;" no-padding>\n\n              \n\n              <div *ngFor="let calidad of calidades">\n\n                  <div *ngIf="calidad.kilos != null">\n\n                <ion-row [ngClass]="{\'color\': calidad.contador%2 > 0}">\n\n                  \n\n                    <ion-col col-4 >\n\n                      {{calidad.calidad}}\n\n                    </ion-col>\n\n                    <ion-col  col-8 style="text-align:right;">\n\n                      {{calidad.kilos}} <strong> Kgs</strong>\n\n                    </ion-col>\n\n                  \n\n                </ion-row>\n\n              </div>\n\n              </div>\n\n            </ion-grid>\n\n          </ion-item>\n\n  \n\n        </ion-list>\n\n        <ion-list>\n\n          <div *ngIf="incidencias.length > 0">\n\n              <ion-item text-wrap no-lines class="greenHeader">\n\n                  INCIDENCIAS\n\n              </ion-item>\n\n              <ion-item>\n\n                  <ion-grid style=" border: 1px solid grey;" no-padding>\n\n              \n\n                      <div *ngFor="let incidencia of incidencias">\n\n                          \n\n                        <ion-row [ngClass]="{\'color\': incidencia.contador%2 > 0}">\n\n                          \n\n                            <ion-col col-12 >\n\n                              {{incidencia.nomincid}}\n\n                            </ion-col>\n\n                        </ion-row>\n\n                      \n\n                      </div>\n\n                    </ion-grid>\n\n              </ion-item>\n\n          </div>\n\n          \n\n          <ion-item no-lines>\n\n            <button ion-button outline item-end round icon-left text-wrap class="myGreen"  (click)="comprobarCorreo()">\n\n              <ion-icon name="git-compare"></ion-icon>\n\n              Enviar clasificacion por correo.\n\n            </button>\n\n          </ion-item>\n\n      </ion-list>\n\n  </ion-content>\n\n  \n\n  <ion-footer>\n\n    <ion-toolbar>\n\n      <ion-title>\n\n        <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n      </ion-title>\n\n    </ion-toolbar>\n\n  </ion-footer>'/*ion-inline-end:"c:\PROYECTOS\AriagroApp\src\pages\modal-calidades-albaran\modal-calidades-albaran.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_local_data_local_data__["a" /* LocalDataProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */]])
    ], ModalCalidadesAlbaranPage);
    return ModalCalidadesAlbaranPage;
}());

//# sourceMappingURL=modal-calidades-albaran.js.map

/***/ })

});
//# sourceMappingURL=9.js.map