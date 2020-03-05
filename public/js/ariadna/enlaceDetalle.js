/*-------------------------------------------------------------------------- 
enlaceDetalle.js
Funciones js par la página AdministradorDetalle.html
---------------------------------------------------------------------------*/
var enlaceId = 0;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmEnlace").submit(function() {
        return false;
    });

    enlaceId = gup('EnlaceId');
    if (enlaceId != 0) {
        var data = {
                enlaceId: enlaceId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/enlaces/" + enlaceId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.enlaceId(0);
    }
}

function admData() {
    var self = this;
    self.enlaceId = ko.observable();
    self.nombre = ko.observable();
    self.url = ko.observable();
}

function loadData(data) {
    vm.enlaceId(data.enlaceId);
    vm.nombre(data.nombre);
    vm.url(data.url);
}

function datosOK() {
    $('#frmEnlace').validate({
        rules: {
            txtNombre: {
                required: true
            },
            txtUrl: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: 'Introduzca el nombre'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmEnlace").validate().settings;
    return $('#frmEnlace').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK()) return;
        var data = {
            enlace: {
                "enlaceId": vm.enlaceId(),
                "url": vm.url(),
                "nombre": vm.nombre()
            }
        };
        if (enlaceId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/enlaces",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EnlacesGeneral.html?EnlaceId=" + vm.enlaceId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/enlaces/" + enlaceId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EnlacesGeneral.html?EnlaceId=" + vm.enlaceId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "EnlacesGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

