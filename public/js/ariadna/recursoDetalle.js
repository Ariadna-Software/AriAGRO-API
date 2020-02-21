/*-------------------------------------------------------------------------- 
recursoDetalle.js
Funciones js par la página AdministradorDetalle.html
---------------------------------------------------------------------------*/
var recursoId = 0;


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
    $("#frmRecurso").submit(function() {
        return false;
    });

    recursoId = gup('RecursoId');
    if (recursoId != 0) {
        var data = {
                recursoId: recursoId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/recursos/" + recursoId,
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
        vm.recursoId(0);
    }
}

function admData() {
    var self = this;
    self.recursoId = ko.observable();
    self.nombre = ko.observable();
    self.url = ko.observable();
}

function loadData(data) {
    vm.recursoId(data.recursoId);
    vm.nombre(data.nombre);
    vm.url(data.url);
}

function datosOK() {
    $('#frmRecurso').validate({
        rules: {
            txtNombre: {
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
    var opciones = $("#frmRecurso").validate().settings;
    return $('#frmRecurso').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            recurso: {
                "recursoId": vm.recursoId(),
                "url": vm.url(),
                "nombre": vm.nombre()
            }
        };
        if (recursoId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/recursos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "RecursosGeneral.html?RecursoId=" + vm.recursoId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/recursos/" + recursoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "RecursosGeneral.html?RecursoId=" + vm.recursoId();
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
        var url = "RecursosGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
