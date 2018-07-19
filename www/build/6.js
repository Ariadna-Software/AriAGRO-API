webpackJsonp([6],{

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParametrosPageModule", function() { return ParametrosPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__parametros__ = __webpack_require__(458);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ParametrosPageModule = /** @class */ (function () {
    function ParametrosPageModule() {
    }
    ParametrosPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__parametros__["a" /* ParametrosPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__parametros__["a" /* ParametrosPage */]),
            ],
        })
    ], ParametrosPageModule);
    return ParametrosPageModule;
}());

//# sourceMappingURL=parametros.module.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ParametrosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_local_data_local_data__ = __webpack_require__(199);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ParametrosPage = /** @class */ (function () {
    function ParametrosPage(navCtrl, appVersion, navParams, formBuilder, alertCrtl, viewCtrl, ariagroData, localData) {
        this.navCtrl = navCtrl;
        this.appVersion = appVersion;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCrtl = alertCrtl;
        this.viewCtrl = viewCtrl;
        this.ariagroData = ariagroData;
        this.localData = localData;
        this.settings = {};
        this.version = "ARIAGRO APP V2";
        this.submitAttempt = false;
        this.numeroCooperativa = "";
        this.parametrosForm = formBuilder.group({
            numeroCooperativa: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])]
        });
    }
    ParametrosPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.viewCtrl.setBackButtonText('');
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
    ParametrosPage.prototype.doSearch = function () {
        var _this = this;
        this.submitAttempt = true;
        if (this.parametrosForm.valid) {
            this.ariagroData.getParametrosCentral(this.numeroCooperativa)
                .subscribe(function (data) {
                _this.settings.parametros = data;
                _this.localData.saveSettings(_this.settings);
                _this.navCtrl.setRoot('LoginPage');
            }, function (error) {
                if (error.status == 404) {
                    var alert_1 = _this.alertCrtl.create({
                        title: "AVISO",
                        subTitle: "No se ha encontrado ninguna cooperativa con ese número",
                        buttons: ['OK']
                    });
                    alert_1.present();
                }
                else {
                    var alert_2 = _this.alertCrtl.create({
                        title: "ERROR",
                        subTitle: JSON.stringify(error, null, 4),
                        buttons: ['OK']
                    });
                    alert_2.present();
                }
            });
        }
    };
    ParametrosPage.prototype.goHome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    ParametrosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-parametros',template:/*ion-inline-start:"C:\PROYECTOS\AriagroApp\src\pages\parametros\parametros.html"*/'<ion-header>\n\n  <ion-navbar>\n\n   <ion-title>\n\n      {{version}}\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="myGreen" (click)="goHome()">\n\n        <ion-icon name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <ion-item text-wrap no-lines class="greenHeader">\n\n      <h2>LOGIN / AJUSTES [CONEXIÓN]</h2>\n\n    </ion-item>\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-4>\n\n          <div class="psb">\n\n            <img src="assets/imgs/ajustes.png">\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-8>\n\n          Introduzca su número de cooperativa para poder obtener sus parámetros de conexión\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n    <form [formGroup]="parametrosForm" no-lines>\n\n      <ion-item>\n\n        <ion-label stacked>NÚMERO DE COOPERATIVA</ion-label>\n\n        <ion-input formControlName="numeroCooperativa" type="text" [(ngModel)]="numeroCooperativa"></ion-input>\n\n      </ion-item>\n\n      <ion-item *ngIf="!parametrosForm.controls.numeroCooperativa.valid  && submitAttempt" no-lines>\n\n        <p style="color:red">Debe introducir un valor.</p>\n\n      </ion-item>\n\n    </form>\n\n    <ion-item no-lines>\n\n      <button ion-button outline item-end round icon-left class="myGreen" (click)="doSearch()">\n\n        <ion-icon name="search"></ion-icon>\n\n        Buscar\n\n      </button>\n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"C:\PROYECTOS\AriagroApp\src\pages\parametros\parametros.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__["a" /* AppVersion */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_5__providers_local_data_local_data__["a" /* LocalDataProvider */]])
    ], ParametrosPage);
    return ParametrosPage;
}());

//# sourceMappingURL=parametros.js.map

/***/ })

});
//# sourceMappingURL=6.js.map