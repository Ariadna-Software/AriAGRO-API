webpackJsonp([11],{

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPageModule", function() { return LoginPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login__ = __webpack_require__(451);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LoginPageModule = /** @class */ (function () {
    function LoginPageModule() {
    }
    LoginPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__login__["a" /* LoginPage */]),
            ],
        })
    ], LoginPageModule);
    return LoginPageModule;
}());

//# sourceMappingURL=login.module.js.map

/***/ }),

/***/ 451:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_local_data_local_data__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__ = __webpack_require__(202);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, appVersion, navParams, plt, loadingCtrl, formBuilder, alertCrtl, viewCtrl, ariagroData, localData, oneSignal) {
        this.navCtrl = navCtrl;
        this.appVersion = appVersion;
        this.navParams = navParams;
        this.plt = plt;
        this.loadingCtrl = loadingCtrl;
        this.formBuilder = formBuilder;
        this.alertCrtl = alertCrtl;
        this.viewCtrl = viewCtrl;
        this.ariagroData = ariagroData;
        this.localData = localData;
        this.oneSignal = oneSignal;
        this.settings = {};
        this.version = "ARIAGRO APP V2";
        this.submitAttempt = false;
        this.login = "";
        this.password = "";
        this.nombreCooperativa = "LA COOPPP";
        this.loginForm = formBuilder.group({
            login: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])],
            password: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])]
        });
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.nombreCooperativa = _this.settings.parametros.nombre;
                _this.viewCtrl.setBackButtonText('');
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
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        this.submitAttempt = true;
        if (this.loginForm.valid) {
            this.ariagroData.login(this.settings.parametros.url, this.login, this.password)
                .subscribe(function (data) {
                _this.settings.user = data;
                _this.settings.campanya = {
                    codempre: 0,
                    nomresum: 'Campaña actual',
                    ariagro: 'ariagro'
                };
                _this.localData.saveSettings(_this.settings);
                _this.pushUser(_this.settings.user);
                _this.navCtrl.setRoot('HomePage');
            }, function (error) {
                if (error.status == 404) {
                    _this.showAlert("AVISO", "Usuario o contraseña incorrectos");
                }
                else {
                    _this.showAlert("ERROR", JSON.stringify(error, null, 4));
                }
            });
        }
    };
    LoginPage.prototype.pushUser = function (user) {
        var _this = this;
        this.plt.ready().then(function () {
            // obtener los parámetros
            var loading = _this.loadingCtrl.create({ content: 'Buscando mensajes...' });
            loading.present();
            _this.ariagroData.getParametros(_this.settings.parametros.url)
                .subscribe(function (data) {
                loading.dismiss();
                var config = _this.settings;
                config.paramPush = data;
                _this.localData.saveSettings(config);
                try {
                    // Registro OneSignal
                    _this.oneSignal.startInit(config.paramPush.appId, config.paramPush.gcm);
                    _this.oneSignal.getIds().then(function (ids) {
                        var myUser = _this.settings.user;
                        //alert(JSON.stringify(ids));
                        if (config.user.playerId != ids.userId) {
                            myUser.playerId = ids.userId;
                            _this.ariagroData.putUsuario(_this.settings.parametros.url, myUser.usuarioPushId, myUser)
                                .subscribe(function (data) {
                                _this.settings.user = data;
                            }, function (err) {
                                loading.dismiss();
                                console.log("PUT usuario error");
                            });
                        }
                    }, function (error) {
                        if (error.status == 404) {
                            _this.showAlert("AVISO", "Usuario o contraseña incorrectos");
                        }
                    });
                    _this.oneSignal.endInit();
                }
                catch (e) {
                    console.log("Error de carga de oneSignal");
                }
            }, function (err) {
                loading.dismiss();
                if (err) {
                    var msg = err || err.message;
                    _this.showAlert("ERROR", msg);
                }
            });
        });
    };
    LoginPage.prototype.goConexion = function () {
        this.navCtrl.push('ParametrosPage');
    };
    LoginPage.prototype.goHome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    LoginPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\PROYECTOS\AriagroApp\src\pages\login\login.html"*/'<ion-header>\n\n  <ion-navbar>\n\n   <ion-title>\n\n      {{version}}\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="myGreen" (click)="goHome()">\n\n        <ion-icon name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <ion-item text-wrap no-lines class="greenHeader">\n\n      <h2>LOGIN / AJUSTES [LOGIN]</h2>\n\n    </ion-item>\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-4>\n\n          <div class="psb">\n\n            <img src="assets/imgs/ajustes.png">\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-8 class="justificar">\n\n          Bienvenido a {{nombreCooperativa}}. Introduzca sus datos para poder acceder a la aplicación.\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n    <form [formGroup]="loginForm" no-lines>\n\n      <ion-item>\n\n        <ion-label stacked>USUARIO</ion-label>\n\n        <ion-input formControlName="login" type="text" [(ngModel)]="login"></ion-input>\n\n      </ion-item>\n\n      <ion-item *ngIf="!loginForm.controls.login.valid  && submitAttempt" no-lines>\n\n        <p style="color:red">Se necesita un usuario.</p>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label stacked>CONTRASEÑA</ion-label>\n\n        <ion-input formControlName="password" type="password" [(ngModel)]="password"></ion-input>\n\n      </ion-item>\n\n      <ion-item *ngIf="!loginForm.controls.password.valid  && submitAttempt" no-lines>\n\n        <p style="color:red">Se necesita una contraseña.</p>\n\n      </ion-item>\n\n    </form>\n\n    <ion-item no-lines>\n\n      <button ion-button outline item-end round icon-left class="myGreen" (click)="goConexion()">\n\n        <ion-icon name="cog"></ion-icon>\n\n        Parámetros\n\n      </button>\n\n      <button ion-button outline item-end round icon-left class="myGreen" (click)="doLogin()">\n\n        <ion-icon name="checkmark"></ion-icon>\n\n        Aceptar\n\n      </button>\n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"C:\PROYECTOS\AriagroApp\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__["a" /* AppVersion */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_5__providers_local_data_local_data__["a" /* LocalDataProvider */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__["a" /* OneSignal */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ })

});
//# sourceMappingURL=11.js.map