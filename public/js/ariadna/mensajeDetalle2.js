/*-------------------------------------------------------------------------- 
mensajeDetalle.js
Funciones js par la página MensajeDetalle.html
---------------------------------------------------------------------------*/
var mensId = 0;

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
    $("#frmMensaje").submit(function() {
        return false;
    });

    // NUEVO EDITOR msghtml
    console.log('Nuevo editor');
    CKEDITOR.replace('msghtml', {
        language: 'es'
    });

    initTablaMensajes();

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
                var user = JSON.parse(getCookie("administrador"));
                vm.adminId(user.administradorId);
                loadData(data);
                buscarMensajesUsuario(data.mensajeId)
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
    self.adminId = ko.observable();
}

function loadData(data) {
    vm.mensajeId(data.mensajeId);
    vm.asunto(data.asunto);
    vm.texto(data.texto);
    CKEDITOR.instances.txtTexto.setData(vm.texto());
    // cambiamos el título por si imprimen
    document.title = "Ariadna Noticaciones (Mensaje: " + data.asunto + ")";

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
                "usuarioPushId": vm.sUsuarioPushId(),
                "ariagro": vm.ariagro(),
                "tienda": vm.tienda(),
                "gasolinera": vm.gasolinera(),
                "telefonia": vm.telefonia(),
                "administradorId": vm.adminId()
            }
        };
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/mensajes/sendnew",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // Nos volvemos al general
                var url = "MensajesGeneral.html?MensajeId=" + vm.mensajeId();
                window.open(url, '_self');
            },
            error: errorAjax
        });

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


function initTablaMensajes() {
    tablaCarro = $('#dt_mensaje').dataTable({
        autoWidth: true,
        bSort: false,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
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
            search: "Buscar: ",
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
            data: "nombre",
        }, {
            data: "estado"
        }, {
            data: "telefono1"
        }, {
            data: "telefono2"
        }, {
            data: "email"
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

function buscarMensajesUsuario(mensajeId) {
    // enviar la consulta por la red (AJAX)
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/mensajes/usuarios-mensaje/" + mensajeId,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // hay que mostrarlo en la zona de datos
            loadTablaMensajes(data);
        },
        error: errorAjax
    });
}
