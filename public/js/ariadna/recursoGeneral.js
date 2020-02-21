/*-------------------------------------------------------------------------- 
recursoGeneral.js
Funciones js par la página AdministradorGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRecursos;
var recursoId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var s3 = undefined;
var bucket, bucket_folder, identity_pool;


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarRecursos());
    $('#btnAlta').click(crearRecurso());
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarRecursos();
    //});
    //
    initTablaRecursos();
    // comprobamos parámetros
    recursoId = gup('RecursoId');
    if (recursoId !== '') {
        // cargar la tabla con un único valor que es el que corresponde.
        var data = {
            id: recursoId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/recursos/" + recursoId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                var data2 = [data];
                loadTablaRecursos(data2);
            },
            error: errorAjax
        });
    }else{
       $('#txtBuscar').val('*');
       buscarRecursos()();
       $('#txtBuscar').val('');
    }

    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/parametros",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data, status) {
            // Leemos los parámetros para inicializar AWS
            var parametro = data[0];
            bucket = parametro.bucket;
            if (!bucket) {
                alert('El servicio de recursos no está disponible. Póngase en contacto con Ariadna Software si desea activarlo');
                var url = "index.html";
                window.open(url, '_self');                
            }            
            bucket_folder = parametro.bucket_folder;
            identity_pool = parametro.identity_pool;
            AWS.config.update({
                region: parametro.bucket_region,
                credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: parametro.identity_pool
                })
            });
            
            s3 = new AWS.S3({
                apiVersion: "2006-03-01",
                params: { Bucket: parametro.bucket }
            });
        },
        error: errorAjax
    });    
}

function initTablaRecursos() {
    tablaCarro = $('#dt_recurso').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_recurso'), breakpointDefinition);
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
        data: dataRecursos,
        columns: [{
            data: "nombre"
        },{
            data: "url"
        }, {
            data: "recursoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteRecurso(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='editRecurso(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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

function loadTablaRecursos(data) {
    var dt = $('#dt_recurso').dataTable();
    if (data !== null && data.length === 0) {
        mostrarMensajeSmart('No se han encontrado registros');
        $("#tbRecurso").hide();
    } else {
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
        $("#tbRecurso").show();
    }
}

function buscarRecursos(result) {
    var mf = function () {
        if(result) {
            $('#txtBuscar').val('*');
        }
        if (!datosOK()) {
            return;
        }
        // obtener el n.serie del certificado para la firma.
        var aBuscar = $('#txtBuscar').val();
        if(result) {
            $('#txtBuscar').val('');
        }
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/recursos/?nombre=" + aBuscar,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaRecursos(data);
            },
            error: errorAjax
        });
    };
    return mf;
}

function crearRecurso() {
    var mf = function () {
        var url = "RecursoDetalle.html?RecursoId=0";
        window.open(url, '_self');
    };
    return mf;
}

function deleteRecurso(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                recursoId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/recursos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var datos = data.url.split(bucket_folder);
                    var key = bucket_folder + datos[1];
                    s3.deleteObject({ Key: key }, function(err, data) {
                        var fn = buscarRecursos(true);
                        fn();
                      });
                },
                error: errorAjax
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editRecurso(id) {
    // hay que abrir la página de detalle de recurso
    // pasando en la url ese ID
    var url = "RecursoDetalle.html?RecursoId=" + id;
    window.open(url, '_self');
}


