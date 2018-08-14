webpackJsonp([23],{

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EntradasPageModule", function() { return EntradasPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__anticipos_detalle__ = __webpack_require__(458);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var EntradasPageModule = /** @class */ (function () {
    function EntradasPageModule() {
    }
    EntradasPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__anticipos_detalle__["a" /* AnticiposDetallePage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__anticipos_detalle__["a" /* AnticiposDetallePage */]),
            ],
        })
    ], EntradasPageModule);
    return EntradasPageModule;
}());

//# sourceMappingURL=anticipos-detalle.module.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnticiposDetallePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__ = __webpack_require__(199);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AnticiposDetallePage = /** @class */ (function () {
    function AnticiposDetallePage(navCtrl, appVersion, navParams, alertCrtl, viewCtrl, ariagroData, localData) {
        this.navCtrl = navCtrl;
        this.appVersion = appVersion;
        this.navParams = navParams;
        this.alertCrtl = alertCrtl;
        this.viewCtrl = viewCtrl;
        this.ariagroData = ariagroData;
        this.localData = localData;
        this.settings = {};
        this.version = "ARIAGRO APP V2";
        this.campanya = {};
        this.user = {};
        this.anticipo = {};
    }
    AnticiposDetallePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                _this.user = _this.settings.user;
                _this.campanya = _this.settings.campanya;
                _this.anticipo = _this.navParams.get('anticipo');
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
    AnticiposDetallePage.prototype.goHome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    AnticiposDetallePage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    };
    AnticiposDetallePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-anticipos-detalle',template:/*ion-inline-start:"c:\PROYECTOS\AriagroApp\src\pages\anticipos-detalle\anticipos-detalle.html"*/'<ion-header>\n\n  <ion-navbar>\n\n   <ion-title>\n\n      {{version}}\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="myGreen" (click)="goHome()">\n\n        <ion-icon name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <ion-item text-wrap no-lines class="greenHeader">\n\n      {{anticipo.nomtipom}}\n\n      <br> {{campanya.nomresum}}\n\n      <br> {{anticipo.factura}} {{anticipo.fecfactu}}\n\n      <br> Base: {{anticipo.baseimpo}} € IVA: {{anticipo.imporiva}} € \n\n      <br> Retención: {{anticipo.impreten}} € \n\n      <br> TOTAL: {{anticipo.totalfac}} €\n\n    </ion-item>\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-4>\n\n          <div class="psb">\n\n            <img src="assets/imgs/anticipos.png">\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-8 class="justificar">\n\n          Este es el detalle del anticipo / liquidación seleccionado.\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n  </ion-list>\n\n  <ion-list>\n\n    <ion-item *ngFor="let linea of anticipo.lineas" text-wrap>\n\n      <span class="myGreen">{{linea.nomvarie}}</span>\n\n      <br>{{linea.kilosnet}} Kg. {{linea.imporvar}} €\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"c:\PROYECTOS\AriagroApp\src\pages\anticipos-detalle\anticipos-detalle.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__["a" /* AppVersion */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__["a" /* LocalDataProvider */]])
    ], AnticiposDetallePage);
    return AnticiposDetallePage;
}());

//# sourceMappingURL=anticipos-detalle.js.map

/***/ })

});
//# sourceMappingURL=23.js.map