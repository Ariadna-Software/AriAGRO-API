webpackJsonp([8],{

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalCalidadesCampoPageModule", function() { return ModalCalidadesCampoPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modal_calidades_campo__ = __webpack_require__(456);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var ModalCalidadesCampoPageModule = /** @class */ (function () {
    function ModalCalidadesCampoPageModule() {
    }
    ModalCalidadesCampoPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__modal_calidades_campo__["a" /* ModalCalidadesCampoPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__modal_calidades_campo__["a" /* ModalCalidadesCampoPage */]),
            ],
        })
    ], ModalCalidadesCampoPageModule);
    return ModalCalidadesCampoPageModule;
}());

//# sourceMappingURL=modal-calidades-campo.module.js.map

/***/ }),

/***/ 456:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalCalidadesCampoPage; });
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





var ModalCalidadesCampoPage = /** @class */ (function () {
    function ModalCalidadesCampoPage(navCtrl, navParams, viewCtrl, localData, alertCrtl, loadingCtrl, ariagroData) {
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
        this.campo = {};
        this.calidades = [];
    }
    ModalCalidadesCampoPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.localData.getSettings().then(function (data) {
            if (data) {
                _this.settings = JSON.parse(data);
                _this.viewCtrl.setBackButtonText('');
                _this.user = _this.settings.user;
                _this.campanya = _this.settings.campanya;
                _this.campo = _this.navParams.get('campo');
                _this.loadCalidades();
            }
            else {
                _this.navCtrl.setRoot('ParametrosPage');
            }
        });
    };
    ModalCalidadesCampoPage.prototype.loadCalidades = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: 'Buscando clasificacion...' });
        loading.present();
        this.ariagroData.getCampoClasificacion(this.settings.parametros.url, this.campo.codcampo, this.campanya.ariagro)
            .subscribe(function (data) {
            loading.dismiss();
            _this.calidades = _this.prepareData(data);
        }, function (error) {
            loading.dismiss();
            _this.showAlert("ERROR", JSON.stringify(error, null, 4));
        });
    };
    ModalCalidadesCampoPage.prototype.prepareData = function (calidades) {
        var contador = 1;
        calidades.forEach(function (a) {
            if (a.kilos != null) {
                a.contador = contador++;
                a.kilos = __WEBPACK_IMPORTED_MODULE_4_numeral__(a.kilos).format('0,0');
            }
        });
        return calidades;
    };
    ModalCalidadesCampoPage.prototype.showAlert = function (title, subTitle) {
        var alert = this.alertCrtl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    };
    ModalCalidadesCampoPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ModalCalidadesCampoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-modal-calidades-campo',template:/*ion-inline-start:"C:\PROYECTOS\AriagroApp\src\pages\modal-calidades-campo\modal-calidades-campo.html"*/'\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n      <ion-buttons end>\n\n          <button ion-button icon-only (click)="dismiss()">\n\n            <ion-icon class="myGreen" ios="ios-arrow-back" md="md-arrow-back"></ion-icon>\n\n          </button>\n\n        </ion-buttons>\n\n    <ion-title>CAMPO: {{campo.codcampo}}</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n    <ion-list>\n\n        <ion-item text-wrap no-lines class="greenHeader">\n\n          Partida: {{campo.nomparti}}\n\n          <br> Polígono: {{campo.poligono}} Parcela: {{campo.parcela}}\n\n          <br> {{campo.kilos}} kg\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n    <ion-list>\n\n      <ion-item no-lines *ngIf="calidades.length > 0 " >         \n\n        <ion-grid style=" border: 1px solid grey;" no-padding>\n\n          \n\n          <div *ngFor="let calidad of calidades">\n\n              <div *ngIf="calidad.kilos != null">\n\n            <ion-row [ngClass]="{\'color\': calidad.contador%2 > 0}">\n\n              \n\n                <ion-col col-4 >\n\n                  {{calidad.calidad}}\n\n                </ion-col>\n\n                <ion-col  col-8 style="text-align:right;">\n\n                  {{calidad.kilos}} <strong> Kgs</strong>\n\n                </ion-col>\n\n              \n\n            </ion-row>\n\n          </div>\n\n          </div>\n\n        </ion-grid>\n\n      </ion-item>\n\n    </ion-list>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span style="font-size:0.8em;">(c) Ariadna SW 2018</span>\n\n    </ion-title>\n\n  </ion-toolbar>\n\n</ion-footer>\n\n'/*ion-inline-end:"C:\PROYECTOS\AriagroApp\src\pages\modal-calidades-campo\modal-calidades-campo.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_local_data_local_data__["a" /* LocalDataProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_ariagro_data_ariagro_data__["a" /* AriagroDataProvider */]])
    ], ModalCalidadesCampoPage);
    return ModalCalidadesCampoPage;
}());

//# sourceMappingURL=modal-calidades-campo.js.map

/***/ })

});
//# sourceMappingURL=8.js.map