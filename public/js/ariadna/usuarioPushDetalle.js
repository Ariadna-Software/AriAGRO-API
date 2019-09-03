/*-------------------------------------------------------------------------- 
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

    // autosalto en IBAN
    $(function () {
        $(".ibans").keyup(function () {
            if (this.value.length == this.maxLength) {
                var r = $(this).attr('id').substr(0, 7);
                var n = $(this).attr('id').substr(7);
                var n1 = n * 1 + 1;
                var r2 = r + n1;
                $("#" + r2).focus();
            }
        });
    });
}

function admData() {
    var self = this;
    self.usuarioPushId = ko.observable();
    self.nif = ko.observable();
    self.nombre = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.email = ko.observable();
    self.comunId = ko.observable();
    self.ariagroId = ko.observable();
    self.tiendaId = ko.observable();
    self.gasolineraId = ko.observable();
    self.telefoniaId = ko.observable();
    self.playerId = ko.observable();
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.telefono1 = ko.observable();
    self.telefono2 = ko.observable();
    self.iban = ko.observable();
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
    self.soloMensajes = ko.observable();
    self.esTrabajador = ko.observable();
    self.tratamientosId = ko.observable();
}

function loadData(data) {
    vm.usuarioPushId(data.usuarioPushId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
    vm.nif(data.nif);
    vm.comunId(data.comunId);
    vm.ariagroId(data.ariagroId);
    vm.tiendaId(data.tiendaId);
    vm.gasolineraId(data.gasolineraId);
    vm.telefoniaId(data.telefoniaId);
    vm.playerId(data.playerId);
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.poblacion(data.poblacion);
    vm.provincia(data.provincia);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.iban(data.iban);
    vm.soloMensajes(data.soloMensajes);
    vm.esTrabajador(data.esTrabajador);
    vm.tratamientosId(data.tratamientosId);

    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{1,4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }
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
     // mas controles
    // iban
    if(vm.iban1() == undefined) {
        vm.iban1("");
    }
    if(vm.iban2() == undefined) {
        vm.iban2("");
    }
    if(vm.iban3() == undefined) {
        vm.iban3("");
    }
    if(vm.iban4() == undefined) {
        vm.iban4("");
    }
    if(vm.iban5() == undefined) {
        vm.iban5("");
    }
    if(vm.iban6() == undefined) {
        vm.iban6("");
    }
    vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
    if (vm.iban() && vm.iban() != "") {
        var IBAN = vm.iban();
        if (IBAN.length < 24) {
            mostrarMensajeSmart("IBAN incorrecto");
            return false;
        }
    }
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
                "comunId": vm.comunId(),
                "ariagroId": vm.ariagroId(),
                "tiendaId": vm.tiendaId(),
                "gasolineraId": vm.gasolineraId(),
                "telefoniaId": vm.telefoniaId(),
                "direccion": vm.direccion(),
                "codPostal": vm.codPostal(),
                "poblacion": vm.poblacion(),
                "provincia": vm.provincia(),
                "telefono1": vm.telefono1(),
                "telefono2": vm.telefono2(),
                "iban": vm.iban(),
                "soloMensajes": vm.soloMensajes(),
                "esTrabajador": vm.esTrabajador(),
                "tratamientosId": vm.tratamientosId()
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
