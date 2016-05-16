﻿/*-------------------------------------------------------------------------- 
usuarioPushDetalle.js
Funciones js par la página UsuarioPushDetalle.html
---------------------------------------------------------------------------*/
var usuPushId = 0;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataMensajes;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


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
    $("#frmUsuarioPush").submit(function() {
        return false;
    });

    initTablaMensajes();

    usuPushId = gup('UsuarioPushId');
    if (usuPushId != 0) {
        var data = {
                usuarioPushId: usuPushId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usupush/" + usuPushId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                buscarMensajesUsuario(data.usuarioPushId);
            },
            error: errorAjax
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.usuarioPushId(0);
    }
}

function admData() {
    var self = this;
    self.usuarioPushId = ko.observable();
    self.nif = ko.observable();
    self.nombre = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.email = ko.observable();
    self.ariagroId = ko.observable();
    self.tiendaId = ko.observable();
    self.gasolineraId = ko.observable();
    self.telefoniaId = ko.observable();
    self.playerId = ko.observable();
}

function loadData(data) {
    vm.usuarioPushId(data.usuarioPushId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
    vm.nif(data.nif);
    vm.ariagroId(data.ariagroId);
    vm.tiendaId(data.tiendaId);
    vm.gasolineraId(data.gasolineraId);
    vm.telefoniaId(data.telefoniaId);
    vm.playerId(data.playerId);
}

function datosOK() {
    // antes de la validación de form hay que verificar las password
    if ($('#txtPassword1').val() !== "") {
        // si ha puesto algo, debe coincidir con el otro campo
        if ($('#txtPassword1').val() !== $('#txtPassword2').val()) {
            mostrarMensajeSmart('Las contraseñas no coinciden');
            return false;
        }
        vm.password($("#txtPassword1").val());
    }
    // controlamos que si es un alta debe dar una contraseña.
    if (vm.usuarioPushId() === 0 && $('#txtPassword1').val() === "") {
        mostrarMensajeSmart('Debe introducir una contraseña en el alta');
        return false;
    }
    $('#frmUsuarioPush').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtLogin: {
                required: true
            },
            txtEmail: {
                email: true
            }
        },
        // Messages for form validation
        messages: {
            txtNif: {
                required: 'Introduzca nif'
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtLogin: {
                required: 'Introduzca el login'
            },
            txtEmail: {
                email: 'Debe usar un correo válido'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmUsuarioPush").validate().settings;
    return $('#frmUsuarioPush').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            usuarioPush: {
                "usuarioPushId": vm.usuarioPushId(),
                "login": vm.login(),
                "email": vm.email(),
                "nombre": vm.nombre(),
                "password": vm.password(),
                "nif": vm.nif(),
                "ariagroId": vm.ariagroId(),
                "tiendaId": vm.tiendaId(),
                "gasolineraId": vm.gasolineraId(),
                "telefoniaId": vm.telefoniaId()
            }
        };
        if (usuPushId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/usupush",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UsuariosPushGeneral.html?UsuarioPushId=" + vm.usuarioPushId();
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/usupush/" + usuPushId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UsuariosPushGeneral.html?UsuarioPushId=" + vm.usuarioPushId();
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
        var url = "UsuariosPushGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function initTablaMensajes() {
    tablaCarro = $('#dt_mensaje').dataTable({
        autoWidth: true,
        bSort: false,
        preDrawCallback: function() {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_mensaje'), breakpointDefinition);
            }
        },
        rowCallback: function(nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function(oSettings) {
            responsiveHelper_dt_basic.respond();
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataMensajes,
        columns: [{
            data: "fecha",
            render: function(data, type, row) {
                var html = "";
                if (moment(data).isValid()) {
                    html = moment(data).format('DD/MM/YYYY HH:mm');
                }
                return html;
            }
        }, {
            data: "asunto"
        }, {
            data: "texto"
        }, {
            data: "estado"
        }, {
            data: "fechalec",
            render: function(data, type, row) {
                var html = "";
                if (moment(data).isValid()) {
                    html = moment(data).format('DD/MM/YYYY HH:mm');
                }
                return html;
            }
        }]
    });
}

function loadTablaMensajes(data) {
    var dt = $('#dt_mensaje').dataTable();
    if (data !== null && data.length === 0) {} else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
    }
}

function buscarMensajesUsuario(usuarioPushId) {
    // enviar la consulta por la red (AJAX)
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/mensajes/usuario/" + usuarioPushId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaMensajes(data);
        },
        error: errorAjax
    });
}