// ------------------------------------------------------------------------------------------------
// comun.js:
// contiene las funciones comunes a todas páginas de la aplicación
// ------------------------------------------------------------------------------------------------

//-- Se ejecuta al inciio de todas las páginas

function comprobarLogin() {
    // buscar el cookie
    try {
        var user = JSON.parse(getCookie("administrador"));
    } catch (e) {
        // volver al login
        window.open('login.html', '_self');
    }
    if (!user) {
        window.open('login.html', '_self');
    } else {
        nivelesUsuario(user.nivel);
        // cargar el nombre en la zona correspondiente
        $('#userName').text(user.nombre);
    }
}

function nivelesUsuario(nivel) {
    // ahora hay que hacer las comprobaciones de proasistencia
}

function comprobarLoginTrabajador() {
    // buscar el cookie
    try {
        var trabajador = JSON.parse(getCookie("trabajador"));
    } catch (e) {
        // volver al login
        window.open('login.html', '_self');
    }
    return trabajador;
}

function mostrarMensaje(mens) {
    $("#mensaje").text(mens);
}

function mostrarMensajeSmart(mens) {
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            // no hacemos nada solo queríamos mostrar em mensaje
        }
    });
}

function mostrarMensajeSmartSiNo(mens) {
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            return 'S';
        }
        if (ButtonPressed === "Cancelar") {
            return 'N';
        }
    });
}

var errorAjax = function(xhr, textStatus, errorThrwon) {
    var m = xhr.responseText;
    if (!m) m = "Error general posiblemente falla la conexión";
    mostrarMensajeSmart(m);
}

var errorAjaxSerial = function(xhr) {
    var m = xhr.responseText;
    if (!m) m = "Error general posiblemente falla la conexión";
    mostrarMensajeSmart(m);
}

// gup stands from Get Url Parameters
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results === null)
        return "";
    else
        return results[1];
}

/*
 *   Set and Get Cookies
 *   this funtions come from http://www.w3schools.com/js/js_cookies.asp
 *   they are used in forms in order to and retrieve
 *   field's values in a cookie
 */
function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}

function setCookie(c_name, value, exdays) {
    if (!are_cookies_enabled()) {
        alert("NO COOKIES");
    }
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function deleteCookie(c_name) {
    if (!are_cookies_enabled()) {
        alert("NO COOKIES");
    }
    document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}


function getVersionFooter() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/version",
        dataType: "json",
        contentType: "application/json",
        success: function(data, status) {
            // Regresa el mensaje
            if (!data.version) {
                mostrarMensaje('No se pudo obtener la versión ');
            }
            var a = data.version;
            $("#versionFooter").text(a);

        },
        error: function(xhr, textStatus, errorThrwon) {
            var m = xhr.responseText;
            if (!m) m = "Error general posiblemente falla la conexión";
            mostrarMensaje(m);
        }
    });
}

function controlBotones(trabajador) {
    if (trabajador.evaluador == null) {
        $("#evaluacion").css("visibility", "hidden");
    }
}


// ---------------- Moment related functions

function spanishDate(v) {
    var rd = moment(v).format('DD/MM/YYYY');
    if (rd == 'Invalid date') {
        rd = null;
    }
    return rd;
}

function spanishDbDate(v) {
    if (!v) {
        return null;
    }
    var rd = moment(v, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (rd == 'Invalid date') {
        rd = null;
    }
    return rd;
}

//-------------- DatePicker in Spanish
function datePickerSpanish() {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '&#x3C;Ant',
        nextText: 'Sig&#x3E;',
        currentText: 'Hoy',
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['es']);
}
