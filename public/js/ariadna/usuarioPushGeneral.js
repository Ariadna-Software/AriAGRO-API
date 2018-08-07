/*-------------------------------------------------------------------------- 
usuarioPushGeneral.js
Funciones js par la página UsuarioPushGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataUsuariosPush;
var usuarioPushId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var todos = false;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#cmbInforme').select2();
    //
    $('#btnBuscar').click(buscarUsuariosPush());
    $('#btnAlta').click(crearUsuarioPush());
    $('#chkTodos').change(changeCheck());
    $('#cmbInforme').click(opcionBuscar())
    $('#frmBuscar').submit(function () {
        return false
    });
    loadBusqueda(0);//cargamos el comnbo de busqueda con la opción todos por defecto
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarUsuariosPush();
    //});
    //
    initTablaUsuariosPush();
    // comprobamos parámetros
    usuarioPushId = gup('UsuarioPushId');
    if (usuarioPushId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: usuarioPushId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usupush/" + usuarioPushId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaUsuariosPush(data2);
            },
            error: errorAjax
        });
    } else {
        $('#txtBuscar').val('*');
        buscarUsuariosPushLogados()();
        $('#txtBuscar').val('');
    }
}

function admData() {
    var self = this;
    self.optionsInforme = ko.observableArray([
        {
            'nombreInforme': 'App descargada',
            'valorInforme': 0
        },
        {
            'nombreInforme': 'App sin descargar',
            'valorInforme': 1
        },
        {
            'nombreInforme': 'Todos',
            'valorInforme': 2
        }
    ]);
    self.selectedInforme = ko.observableArray([]);
    self.sInforme = ko.observable();
}

function loadBusqueda(valor) {
    $("#cmbTiposVia").val([valor]).trigger('change');
}



function initTablaUsuariosPush() {
    // tablaCarro = $('#dt_usuarioPush').dataTable({
    //     autoWidth: true,
    //     preDrawCallback: function() {
    //         // Initialize the responsive datatables helper once.
    //         if (!responsiveHelper_dt_basic) {
    //             responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_usuarioPush'), breakpointDefinition);
    //         }
    //     },
    //     rowCallback: function(nRow) {
    //         responsiveHelper_dt_basic.createExpandIcon(nRow);
    //     },
    //     drawCallback: function(oSettings) {
    //         responsiveHelper_dt_basic.respond();
    //     },
    //     language: {
    //         processing: "Procesando...",
    //         info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    //         infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
    //         infoFiltered: "(filtrado de un total de _MAX_ registros)",
    //         infoPostFix: "",
    //         loadingRecords: "Cargando...",
    //         zeroRecords: "No se encontraron resultados",
    //         emptyTable: "Ningún dato disponible en esta tabla",
    //         paginate: {
    //             first: "Primero",
    //             previous: "Anterior",
    //             next: "Siguiente",
    //             last: "Último"
    //         },
    //         aria: {
    //             sortAscending: ": Activar para ordenar la columna de manera ascendente",
    //             sortDescending: ": Activar para ordenar la columna de manera descendente"
    //         }
    //     },
    //     data: dataUsuariosPush,
    //     columns: [{
    //         data: "nombre"
    //     }, {
    //         data: "login"
    //     }, {
    //         data: "email"
    //     }, {
    //         data: "usuarioPushId",
    //         render: function(data, type, row) {
    //             var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteUsuarioPush(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
    //             var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editUsuarioPush(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
    //             var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
    //             return html;
    //         }
    //     }]
    // });

    tablaCarro = $('#dt_usuarioPush').dataTable({
        autoWidth: true,
        bSort: false,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_usuarioPush'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
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
        data: dataUsuariosPush,
        columns: [{
            data: "nombre"
        }, {
            data: "login"
        }, {
            data: "email"
        }, {
            data: "usuarioPushId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteUsuarioPush(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editUsuarioPush(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
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
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaUsuariosPush(data) {
    var dt = $('#dt_usuarioPush').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbUsuarioPush").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbUsuarioPush").show();
    }
}

function buscarUsuariosPush() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usupush/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaUsuariosPush(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function buscarUsuariosPushLogados() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usupush/logados/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaUsuariosPush(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function buscarUsuariosPushSinLogar() {
    var mf = function () {
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usupush/sin-logar/usuarios",
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaUsuariosPush(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function crearUsuarioPush() {
    var mf = function () {
        var url = "UsuarioPushDetalle.html?UsuarioPushId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteUsuarioPush(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                usuarioPushId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/usupush/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarUsuariosPush();
                    fn();
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editUsuarioPush(id) {
    // hay que abrir la página de detalle de usuarioPush
    // pasando en la url ese ID
    var url = "UsuarioPushDetalle.html?UsuarioPushId=" + id;
    window.open(url, '_self');
}


function changeCheck() {
    var mf = function () {
        if ($('#chkTodos').is(':checked')) {
            $('#txtBuscar').val('*');
            buscarUsuariosPush()();
            $('#txtBuscar').val('');
        } else {
            $('#txtBuscar').val('*');
            buscarUsuariosPushLogados()();
            $('#txtBuscar').val('');

        }
    };
    return mf;
}

function opcionBuscar() {
    var mf = function () {
        var opcion = vm.sInforme();
        if (opcion == 0) {
            $('#txtBuscar').val('*');
            buscarUsuariosPushLogados()();
            $('#txtBuscar').val('');
        }
        else if (opcion == 1) {
            buscarUsuariosPushSinLogar()();
        }
        else if (opcion == 2) {
            $('#txtBuscar').val('*');
            buscarUsuariosPush()();
            $('#txtBuscar').val('');
        }
    };
    return mf;
}