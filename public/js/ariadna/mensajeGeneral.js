/*-------------------------------------------------------------------------- 
mensajeGeneral.js
Funciones js par la página MensajeGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataMensajes;
var mensajeId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarMensajes());
    $('#btnAlta').click(crearMensaje());
    $('#frmBuscar').submit(function() {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarMensajes();
    //});
    //
    initTablaMensajes();
    // comprobamos parámetros
    mensajeId = gup('MensajeId');
    if (mensajeId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
                id: mensajeId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/mensajes/" + mensajeId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaMensajes(data2);
            },
            error: errorAjax
        });
    } else {
        $('#txtBuscar').val('*');
        buscarMensajes()();
        $('#txtBuscar').val('');
    }
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
                var html = moment(data).format('DD/MM/YYYY HH:mm');
                return html;
            }
        }, {
            data: "asunto"
        }, {
            data: "texto"
        }, {
            data: "estado"
        }, {
            data: "responsable"
        }, {
            data: "mensajeId",
            render: function(data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteMensaje(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editMensaje(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-primary btn-lg' onclick='enviarMensaje(" + data + ");' title='Enviar mensaje'> <i class='fa fa-rocket fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt3 + " " + bt2 + "" + bt1 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    //TODO: Incluir en la validación si el certificado figura en el almacén de certificados.
    $('#frmBuscar').validate({
        rules: {
            txtBuscar: { required: true },
        },
        // Messages for form validation
        messages: {
            txtBuscar: {
                required: 'Introduzca el texto a buscar'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaMensajes(data) {
    var dt = $('#dt_mensaje').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbMensaje").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbMensaje").show();
    }
}

function buscarMensajes() {
    var mf = function() {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/mensajes/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaMensajes(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function crearMensaje() {
    var mf = function() {
        var url = "MensajeDetalle.html?MensajeId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteMensaje(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                mensajeId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/mensajes/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    $('#txtBuscar').val('*');
                    buscarMensajes()();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editMensaje(id) {
    // hay que abrir la página de detalle de mensaje
    // pasando en la url ese ID
    var url = "MensajeDetalle2.html?MensajeId=" + id;
    window.open(url, '_self');
}

function enviarMensaje(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/mensajes/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            var data2 = {
                mensaje: data
            };
            var user = JSON.parse(getCookie("administrador"));
            data2.mensaje.administradorId = user.administradorId;
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/mensajes/sendnew",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data2),
                success: function(data, status) {
                    // Nos volvemos al general
                    var url = "MensajesGeneral.html?MensajeId=" + id;
                    window.open(url, '_self');
                },
                error: errorAjax
            });
        },
        error: errorAjax
    });
}
