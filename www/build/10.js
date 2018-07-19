webpackJsonp([10],{

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MensajesEnviarPageModule", function() { return MensajesEnviarPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mensajes_enviar__ = __webpack_require__(453);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var MensajesEnviarPageModule = /** @class */ (function () {
    function MensajesEnviarPageModule() {
    }
    MensajesEnviarPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__mensajes_enviar__["a" /* MensajesEnviarPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__mensajes_enviar__["a" /* MensajesEnviarPage */]),
            ],
        })
    ], MensajesEnviarPageModule);
    return MensajesEnviarPageModule;
}());

//# sourceMappingURL=mensajes-enviar.module.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MensajesEnviarPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(15);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MensajesEnviarPage = /** @class */ (function () {
    function MensajesEnviarPage(navCtrl, appVersion, navParams, alertCrtl, viewCtrl, loadingCtrl, ariagroData, localData, formBuilder) {
        this.navCtrl = navCtrl;
        this.appVersion = appVersion;
        this.navParams = navParams;
        this.alertCrtl = alertCrtl;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.ariagroData = ariagroData;
        this.localData = localData;
        this.formBuilder = formBuilder;
        this.settings = {};
        this.version = "ARIAGRO APP V2";
        this.campanya = {};
        this.user = {};
        this.mensajes = [];
        this.correo = {
            texto: ""
        };
        this.texto = "";
        this.submitAttempt = false;
        this.mensForm = formBuilder.group({
            texto: ['', __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].required])]
        });
    }
    MensajesEnviarPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                _this.user = _this.settings.user;
                _this.campanya = _this.settings.campanya;
            }
            else {
                _this.navCtrl.setRoot('ParametrosPage');
            }
        });
        try {
            this.appVersion.getVersionNumber().then(function (vrs) {
                _this.version = "ARIAGRO APP V" + vrs;
            }, function (error) {
                // NO hacemos nada, en realidad protegemos al estar en debug
                // con el navegador
            });
        }
        catch (error) {
        }
    };
    MensajesEnviarPage.prototype.enviarMensaje = function () {
        var _this = this;
        this.submitAttempt = true;
        if (this.mensForm.valid) {
            this.correo.texto = this.texto;
            this.correo.asunto = "Mensaje de " + this.user.nombre;
            var loading_1 = this.loadingCtrl.create({ content: 'Enviando mensaje...' });
            loading_1.present();
            this.ariagroData.postCorreo(this.settings.parametros.url, this.correo)
                .subscribe(function (data) {
                loading_1.dismiss();
                _this.showExito("", "Mensaje enviado con exito");
            }, function (error) {
                loading_1.dismiss();
                if (error) {
                    _this.showAlert("ERROR", JSON.stringify(error, null, 4));
                }
                else {
                    _this.showAlert("ERROR", "Error de conexión. Revise disponibilidad de datos y/o configuración");
                }
            });
        }
        else {
            this.showAlert("ERROR", "No se puede enviar un mensaje sin texto");
        }
    };
    MensajesEnviarPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK'],
        });
        alert.present();
    };
    MensajesEnviarPage.prototype.showExito = function (title, subTitle) {
        var _this = this;
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: [
                {
                    text: 'OK',
                    handler: function () {
                        _this.navCtrl.pop();
                    }
                }
            ]
        });
        alert.present();
    };
    MensajesEnviarPage.prototype.goHome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    MensajesEnviarPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mensajes-enviar',template:/*ion-inline-start:"C:\PROYECTOS\AriagroApp\src\pages\mensajes-enviar\mensajes-enviar.html"*/'<ion-header>\n\n  <ion-navbar>\n\n   <ion-title>\n\n      {{version}}\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="myGreen" (click)="goHome()">\n\n        <ion-icon name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n    <ion-list>\n\n        <ion-item no-lines class="greenHeader">\n\n            ENVIAR MENSAJES \n\n        </ion-item>\n\n        <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-4>\n\n                <div class="psb">\n\n                  <img src="assets/imgs/mensajes.png">\n\n                </div>\n\n              </ion-col>\n\n              <ion-col col-8 class="justificar">\n\n                  Escriba el mensaje que desea hacernos llegar y pulse el botón enviar.\n\n              </ion-col>\n\n            </ion-row>\n\n        </ion-grid>\n\n        <ion-item-divider>\n\n            MENSAJE\n\n        </ion-item-divider>\n\n        <form name="mensForm" [formGroup]="mensForm" no-lines>\n\n            <ion-item no-lines>\n\n                <ion-textarea  placeholder="Escriba aquí el texto de su mensaje" rows="15" id="observac" name="observac" formControlName="texto" [(ngModel)]="texto" ></ion-textarea>\n\n            </ion-item>\n\n        </form>\n\n        <ion-item no-lines>\n\n          <button ion-button outline item-end round icon-left class="myGreen" (click)="enviarMensaje(mensForm)">\n\n            <ion-icon name="send"></ion-icon>\n\n            Enviar\n\n          </button>\n\n      </ion-item>\n\n    </ion-list>\n\n\n\n</ion-content>\n\n\n\n\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>\n\n'/*ion-inline-end:"C:\PROYECTOS\AriagroApp\src\pages\mensajes-enviar\mensajes-enviar.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__["a" /* AppVersion */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__["a" /* LocalDataProvider */], __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormBuilder */]])
    ], MensajesEnviarPage);
    return MensajesEnviarPage;
}());

//# sourceMappingURL=mensajes-enviar.js.map

/***/ })

});
//# sourceMappingURL=10.js.map