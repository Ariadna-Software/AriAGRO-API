webpackJsonp([21],{

/***/ 286:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CamposPageModule", function() { return CamposPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__campos__ = __webpack_require__(436);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var CamposPageModule = /** @class */ (function () {
    function CamposPageModule() {
    }
    CamposPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__campos__["a" /* CamposPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__campos__["a" /* CamposPage */]),
            ],
        })
    ], CamposPageModule);
    return CamposPageModule;
}());

//# sourceMappingURL=campos.module.js.map

/***/ }),

/***/ 436:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CamposPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_numeral__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_numeral___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_numeral__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CamposPage = /** @class */ (function () {
    function CamposPage(navCtrl, appVersion, navParams, alertCrtl, viewCtrl, ariagroData, localData) {
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
        this.variedades = [];
    }
    CamposPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                _this.user = _this.settings.user;
                _this.campanya = _this.settings.campanya;
                _this.ariagroData.getCampos(_this.settings.parametros.url, _this.user.ariagroId, _this.campanya.ariagro)
                    .subscribe(function (data) {
                    _this.cargarVariedades(data);
                }, function (error) {
                    _this.showAlert("ERROR", JSON.stringify(error, null, 4));
                });
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
    CamposPage.prototype.cargarVariedades = function (variedades) {
        var _this = this;
        this.variedades = [];
        variedades.forEach(function (v) {
            v.numkilos = __WEBPACK_IMPORTED_MODULE_5_numeral__(v.numkilos).format('0,0');
            v.campos.forEach(function (c) {
                c.kilos = __WEBPACK_IMPORTED_MODULE_5_numeral__(c.kilos).format('0,0');
            });
            _this.variedades.push(v);
        });
    };
    CamposPage.prototype.toggleSection = function (i) {
        this.variedades[i].open = !this.variedades[i].open;
    };
    CamposPage.prototype.goHome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    CamposPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    };
    CamposPage.prototype.goEntradas = function (campo) {
        this.navCtrl.push('EntradasPage', { campo: campo });
    };
    CamposPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-campos',template:/*ion-inline-start:"c:\PROYECTOS\AriagroApp\src\pages\campos\campos.html"*/'<ion-header>\n\n  <ion-navbar>\n\n   <ion-title>\n\n      {{version}}\n\n    </ion-title>\n\n    <ion-buttons end>\n\n      <button ion-button icon-only class="myGreen" (click)="goHome()">\n\n        <ion-icon name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content padding >\n\n  <ion-list>\n\n    <ion-item text-wrap no-lines class="greenHeader">\n\n      CAMPOS\n\n      <br> {{campanya.nomresum}}\n\n    </ion-item>\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-4>\n\n          <div class="psb">\n\n            <img src="assets/imgs/campos.png">\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-8 class="justificar">\n\n          Escoja la variedad cultivada para ver el detalle de los campos implicados. Seleccione un campo para ver las entradas relacionadas.\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n  </ion-list>\n\n  <ion-list *ngFor="let variedad of variedades; let i = index" no-lines class="outList">\n\n    <ion-item (click)="toggleSection(i)" detail-none [ngClass]="{\'section-active\': variedad.open, \'section\': !variedad.open}">\n\n      <ion-icon item-left name="arrow-forward" *ngIf="!variedad.open"></ion-icon>\n\n      <ion-icon item-left name="arrow-down" *ngIf="variedad.open"></ion-icon>\n\n      {{variedad.nomvarie}}\n\n      <p>{{variedad.numkilos}} Kg.</p>\n\n    </ion-item>\n\n    <ion-list *ngIf="variedad.campos && variedad.open" no-lines>\n\n      <ion-item *ngFor="let campo of variedad.campos; let j = index" detail-none text-wrap (click)="goEntradas(campo)">\n\n        <p>\n\n          <strong>Campo: </strong> {{campo.codcampo}}\n\n          <br>\n\n          \n\n          <span *ngIf="campo.numcampo > 0">\n\n            \n\n                <strong>Orden: </strong> {{campo.numcampo}}\n\n            \n\n          </span>\n\n          <br>\n\n          <strong>Partida: </strong> {{campo.nomparti}}\n\n          <br>\n\n          <strong>Poligono: </strong> {{campo.poligono}}\n\n          <strong>Parcela: </strong> {{campo.parcela}}\n\n          <br>\n\n          <strong>Recintos: </strong> {{campo.recintos}}\n\n          <strong>Kilos: </strong> {{campo.kilos}}\n\n        </p>\n\n        <ion-icon name="log-in" item-end class="myGreen"></ion-icon>\n\n      </ion-item>\n\n    </ion-list>\n\n  </ion-list>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"c:\PROYECTOS\AriagroApp\src\pages\campos\campos.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_app_version__["a" /* AppVersion */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_local_data_local_data__["a" /* LocalDataProvider */]])
    ], CamposPage);
    return CamposPage;
}());

//# sourceMappingURL=campos.js.map

/***/ })

});
//# sourceMappingURL=21.js.map