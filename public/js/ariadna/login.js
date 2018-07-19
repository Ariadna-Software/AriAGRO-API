// Funciones de apoyo a la página login.html
var objeto_window_referencia;
var configuracion_ventana = "height=736,width=414,toolbar=no,scrollbars=no,resizable=yes";

function initForm() {
    // de smart admin
    runAllForms();
    // 
    vm = new loginData();
    ko.applyBindings(vm);
    //
    getVersion();
    // asignación de eventos al clic
    $("#btnLogin").click(loginForm());
    $("#btnMobile").click(goMobile);
    $("#login-form").submit(function () {
        return false;
    });
    // borramos cookies anteriores
    deleteCookie("admin");
}

function loginData() {
    var self = this;
    self.login = ko.observable();
    self.password = ko.observable();
}

var goMobile = function () {
    objeto_window_referencia = window.open("/mobile", "Pagina_CNN", configuracion_ventana);
}

function datosOK() {
    $('#login-form').validate({
        rules: {
            login: { required: true },
            password: { required: true }
        },
        // Messages for form validation
        messages: {
            login: {
                required: 'Introduzca login'

            },
            password: {
                required: 'Introduzca password'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#login-form').valid();
}

function loginForm() {
    var mf = function () {
        if (!datosOK()) {
            return;
        }
        var data = {
            "administrador": {
                "login": vm.login(),
                "password": vm.password()
            }
        };
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/administradores/login",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // Regresa el mensaje
                if (!data) {
                    mostrarMensaje('Login y/o password incorrectos');
                } else {
                    var a = data;
                    // guadar el administrador en los cookies
                    setCookie("administrador", JSON.stringify(a), 1)
                    window.open('index.html', '_self');
                }
            },
            error: function (xhr, textStatus, errorThrwon) {
                var m = xhr.responseText;
                if (!m) m = "Error general posiblemente falla la conexión";
                mostrarMensaje(m);
            }
        });
    };
    return mf;
}

function getVersion() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/version",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // Regresa el mensaje
            if (!data.version) {
                mostrarMensaje('No se pudo obtener la versión ');
            }
            var a = data.version;
            $("#version").text(a);

        },
        error: function (xhr, textStatus, errorThrwon) {
            var m = xhr.responseText;
            if (!m) m = "Error general posiblemente falla la conexión";
            mostrarMensaje(m);
        }
    });
}

