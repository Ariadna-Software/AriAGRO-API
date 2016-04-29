/*-------------------------------------------------------------------------- 
mensajeDetalle.js
Funciones js par la página MensajeDetalle.html
---------------------------------------------------------------------------*/
var mensId = 0;


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
    $("#frmMensaje").submit(function() {
        return false;
    });

    // carga del desplegable.
    loadUsuariosPush();

    $("#cmbUsuariosPush").select2({
        allowClear: true,
        language: {
            errorLoading: function() {
                return "La carga falló";
            },
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Por favor, elimine " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Por favor, introduzca " + t + " car";
                return t == 1 ? n += "ácter" : n += "acteres", n;
            },
            loadingMore: function() {
                return "Cargando más resultados…";
            },
            maximumSelected: function(e) {
                var t = "Sólo puede seleccionar " + e.maximum + " elemento";
                return e.maximum != 1 && (t += "s"), t;
            },
            noResults: function() {
                return "No se encontraron resultados";
            },
            searching: function() {
                return "Buscando…";
            }
        }
    });


    mensId = gup('MensajeId');
    if (mensId != 0) {
        var data = {
                mensajeId: mensId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/mensajes/" + mensId,
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
        vm.mensajeId(0);
    }
}

function admData() {
    var self = this;
    self.mensajeId = ko.observable();
    self.asunto = ko.observable();
    self.texto = ko.observable();
    // soporte de combos
    self.posiblesUsuariosPush = ko.observableArray([]);
    self.elegidosUsuariosPush = ko.observableArray([]);
    // valores escogidos
    self.sUsuarioPushId = ko.observable();
    // valores para checks
    self.ariagro = ko.observable();
    self.tienda = ko.observable();
    self.gasolinera = ko.observable();
    self.telefonia = ko.observable();
}

function loadData(data) {
    vm.mensajeId(data.mensajeId);
    vm.asunto(data.asunto);
    vm.texto(data.texto);
}

function datosOK() {
    $('#frmMensaje').validate({
        rules: {
            txtAsunto: {
                required: true
            },
            txtTexto: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtAsunto: {
                required: 'Introduzca un asunto'
            },
            txtTexto: {
                required: 'Introduzca un texto'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmMensaje").validate().settings;
    return $('#frmMensaje').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            mensaje: {
                "mensajeId": vm.mensajeId(),
                "asunto": vm.asunto(),
                "texto": vm.texto(),
                "usuarioPushId": vm.sUsuarioPushId(),
                "ariagro": vm.ariagro(),
                "tienda": vm.tienda(),
                "gasolinera": vm.gasolinera(),
                "telefonia": vm.telefonia()
            }
        };
        if (mensId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/mensajes",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "MensajesGeneral.html?MensajeId=" + vm.mensajeId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/mensajes/" + mensId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "MensajesGeneral.html?MensajeId=" + vm.mensajeId();
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
        var url = "MensajesGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadUsuariosPush() {
    $.ajax({
        type: "GET",
        url: "/api/usupush/logados",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var usuariosPush = [{ usuarioPushId: 0, nombre: "", playerId:"" }].concat(data);
            vm.posiblesUsuariosPush(usuariosPush);
        },
        error: errorAjax
    });
}