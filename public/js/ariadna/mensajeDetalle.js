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

    // control de los checks
    $('#chkAriagro').change(changeCheck());
    $('#chkTienda').change(changeCheck());
    $('#chkTelefonia').change(changeCheck());
    $('#chkGasolinera').change(changeCheck());
    $('#chkSoloMensajes').change(changeCheck());
    $('#chkEsTrabajador').change(changeCheck());

    // NUEVO EDITOR msghtml
    console.log('Nuevo editor');
    CKEDITOR.replace('msghtml', {
        language: 'es'
    });


    $("#frmMensaje").submit(function() {
        return false;
    });

    // carga del desplegable.
    loadUsuariosPush();

    // control de carga
    createUpload(0);

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

        var user = JSON.parse(getCookie("administrador"));
        vm.adminId(user.administradorId);
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
    self.soloMensajes = ko.observable();
    self.esTrabajador = ko.observable();
    // valores de fichero
    self.fichero = ko.observable("");
    //administrador
    self.adminId = ko.observable();
}

function loadData(data) {
    vm.mensajeId(data.mensajeId);
    vm.asunto(data.asunto);
    vm.texto(data.texto);
    CKEDITOR.instances.txtTexto.setData(vm.texto());
    vm.adminId(data.administradorId);
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
                "texto": CKEDITOR.instances.txtTexto.getData(),
                "usuarios": vm.elegidosUsuariosPush(),
                "ariagro": vm.ariagro(),
                "tienda": vm.tienda(),
                "gasolinera": vm.gasolinera(),
                "telefonia": vm.telefonia(),
                "soloMensajes": vm.soloMensajes(),
                "esTrabajador": vm.esTrabajador(),
                "fichero": vm.fichero(),
                "administradorId": vm.adminId()
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
            //var usuariosPush = [{ usuarioPushId: 0, nombre: "", playerId:"" }].concat(data);
            var usuariosPush = data;
            vm.posiblesUsuariosPush(usuariosPush);
        },
        error: errorAjax
    });
}

function sucUpload(file, data) {
    $('#txtRespuesta').html('Fichero cargado correctamente.<br/> Haga clic en el botón <i class="fa fa-check success"></i> para procesar usuarios.');
    vm.fichero(data.FileName);
    console.log('SucUpload');
    console.log('file: ', data.fileName);
    console.log('data: ', data);
}

function errUpload(file, data) {
    console.log('ErrUpload');
    console.log('file: ', file);
    console.log('data: ', data);
}

function createUpload(id) {
    if (!id) id = 0;
    // montar el control de carga
    $("#uploadImage").pekeUpload({
        multi: false,
        limit: 1,
        allowedExtensions: "xlsx|xls|csv",
        btnText: "  Cargar archivo  ",
        url: myconfig.apiUrl + "/api/uploader",
        onFileError: errUpload,
        onFileSuccess: sucUpload,
    });
}

function changeCheck() {
    var mf = function() {
        var url = "/api/usupush/logados2?dummy=s";
        if ($('#chkAriagro').is(':checked')) url += "&ariagro=s";
        if ($('#chkTienda').is(':checked')) url += "&tienda=s";
        if ($('#chkTelefonia').is(':checked')) url += "&telefonia=s";
        if ($('#chkGasolinera').is(':checked')) url += "&gasolinera=s";
        if ($('#chkSoloMensajes').is(':checked')) url += "&soloMensajes=s";
        if ($('#chkEsTrabajador').is(':checked')) url += "&esTrabajador=s";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                //var usuariosPush = [{ usuarioPushId: 0, nombre: "", playerId:"" }].concat(data);
                var usuariosPush = data;
                vm.posiblesUsuariosPush(usuariosPush);
            },
            error: errorAjax
        });
    };
    return mf;
}
