webpackJsonp([7],{

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalDatosCambiarPageModule", function() { return ModalDatosCambiarPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modal_datos_cambiar__ = __webpack_require__(457);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ModalDatosCambiarPageModule = /** @class */ (function () {
    function ModalDatosCambiarPageModule() {
    }
    ModalDatosCambiarPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__modal_datos_cambiar__["a" /* ModalDatosCambiarPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__modal_datos_cambiar__["a" /* ModalDatosCambiarPage */]),
            ],
        })
    ], ModalDatosCambiarPageModule);
    return ModalDatosCambiarPageModule;
}());

//# sourceMappingURL=modal-datos-cambiar.module.js.map

/***/ }),

/***/ 457:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalDatosCambiarPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_local_data_local_data__ = __webpack_require__(199);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the ModalDatosCambiarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ModalDatosCambiarPage = /** @class */ (function () {
    function ModalDatosCambiarPage(navCtrl, navParams, alertCrtl, viewCtrl, ariagroData, localData, modalCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCrtl = alertCrtl;
        this.viewCtrl = viewCtrl;
        this.ariagroData = ariagroData;
        this.localData = localData;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.settings = {};
        this.user = {};
        this.userCopia = {
            nombre: "",
            direccion: "",
            codPostal: "",
            poblacion: "",
            provincia: "",
            telefono1: "",
            telefono2: "",
            email: "",
            iban: ""
        };
        this.cambioDatos = function () {
            var _this = this;
            var texto = " Datos antes de la modificación \n";
            var label;
            var contador = 0;
            for (var propiedad in this.user) {
                if (this.user[propiedad] != this.userCopia[propiedad]) {
                    label = propiedad.toString();
                    texto += label + ": " + this.userCopia[propiedad] + "\n";
                    contador++;
                }
            }
            texto += " Datos después de la modificación \n";
            for (var propiedad_dos in this.user) {
                if (this.user[propiedad_dos] != this.userCopia[propiedad_dos]) {
                    label = propiedad_dos.toString();
                    texto += label + ": " + this.user[propiedad_dos] + "\n";
                }
            }
            if (contador > 0) {
                var asunto = "Solicitud cambio de datos (" + this.userCopia.nombre + ")";
                var correo = {
                    asunto: asunto,
                    texto: texto
                };
                var loading_1 = this.loadingCtrl.create({ content: 'Enviando correo...' });
                loading_1.present();
                this.ariagroData.postCorreo(this.settings.parametros.url, correo)
                    .subscribe(function (data) {
                    loading_1.dismiss();
                    _this.showExito("", "Mensaje enviado correctamente");
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
                this.showAlert("", "No se ha cambiado ningún dato");
            }
        };
    }
    ModalDatosCambiarPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                if (_this.settings.user) {
                    _this.reemplazaNull(_this.settings.user);
                    _this.user = _this.settings.user;
                }
                else {
                    _this.navCtrl.setRoot('LoginPage');
                }
            }
            else {
                _this.navCtrl.setRoot('ParametrosPage');
            }
        });
    };
    ModalDatosCambiarPage.prototype.reemplazaNull = function (user) {
        for (var propiedad in user) {
            console.log(propiedad, " ", user[propiedad]);
            if (user[propiedad] === null) {
                user[propiedad] = " ";
            }
        }
        this.user = user;
        this.userCopia = JSON.parse(JSON.stringify(user)); //realizamos una copia del objeto user
    };
    ModalDatosCambiarPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK'],
        });
        alert.present();
    };
    ModalDatosCambiarPage.prototype.showExito = function (title, subTitle) {
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
    ModalDatosCambiarPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalDatosCambiarPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-modal-datos-cambiar',template:/*ion-inline-start:"c:\PROYECTOS\AriagroApp\src\pages\modal-datos-cambiar\modal-datos-cambiar.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-buttons end>\n\n            <button ion-button icon-only (click)="dismiss()">\n\n              <ion-icon class="myGreen" ios="ios-arrow-back" md="md-arrow-back"></ion-icon>\n\n            </button>\n\n          </ion-buttons>\n\n      <ion-title>CAMBIO DE DATOS</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n  \n\n<ion-content padding>\n\n    <ion-list>\n\n        <ion-item text-wrap no-lines class="greenHeader">\n\n            {{userCopia.nombre}}\n\n        </ion-item>\n\n        \n\n        <ion-grid>\n\n            <ion-row>\n\n              <ion-col col-4>\n\n                <div class="psb">\n\n                  <img src="assets/imgs/datos.png">\n\n                </div>\n\n              </ion-col>\n\n              <ion-col col-8 class="justificar">\n\n                Modifique los datos que desee y pulse el bótón enviar al final de la pantalla.\n\n              </ion-col>\n\n            </ion-row>\n\n          </ion-grid>\n\n    </ion-list>\n\n    <ion-list>\n\n        \n\n            <form  no-lines>\n\n            \n\n            <ion-item >\n\n                <ion-label  color="teal" stacked>Nombre:</ion-label>\n\n                <ion-input  value="{{user.nombre}}" [(ngModel)]="user.nombre" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Nif:</ion-label>\n\n                <ion-input value="{{user.nif}}" [(ngModel)]="user.nif" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Dirección:</ion-label>\n\n                <ion-input value="{{user.direccion}}" [(ngModel)]="user.direccion" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Cod. postal:</ion-label>\n\n                <ion-input value="{{user.codPostal}}" [(ngModel)]="user.codPostal" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Poblacion:</ion-label>\n\n                <ion-input value="{{user.poblacion}}" [(ngModel)]="user.poblacion" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Provincia:</ion-label>\n\n                <ion-input value="{{user.provincia}}" [(ngModel)]="user.provincia" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Telefono (1):</ion-label>\n\n                <ion-input value="{{user.telefono1}}" [(ngModel)]="user.telefono1" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Telefono (2):</ion-label>\n\n                <ion-input value="{{user.telefono2}}" [(ngModel)]="user.telefono2" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>Correo:</ion-label>\n\n                <ion-input value="{{user.email}}" [(ngModel)]="user.email" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item >\n\n                <ion-label color="teal" stacked>IBAN:</ion-label>\n\n                <ion-input value="{{user.iban}}" [(ngModel)]="user.iban" [ngModelOptions]="{standalone: true}"></ion-input>\n\n            </ion-item>\n\n            <ion-item no-lines>\n\n                <button ion-button outline item-end round icon-left text-wrap class="myGreen"  (click)="cambioDatos()">\n\n                  <ion-icon name="git-compare"></ion-icon>\n\n                  Solicitar cambio\n\n                </button>\n\n            </ion-item>\n\n           \n\n          </form>\n\n          \n\n    </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"c:\PROYECTOS\AriagroApp\src\pages\modal-datos-cambiar\modal-datos-cambiar.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_local_data_local_data__["a" /* LocalDataProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], ModalDatosCambiarPage);
    return ModalDatosCambiarPage;
}());

//# sourceMappingURL=modal-datos-cambiar.js.map

/***/ })

});
//# sourceMappingURL=7.js.map