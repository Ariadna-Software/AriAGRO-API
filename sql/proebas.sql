SELECT m.asunto, u.nombre, mu.estado, mu.fecha AS fechalec
FROM mensajes AS m
LEFT JOIN mensajes_usuariospush AS mu ON (mu.mensajeId = m.mensajeId)
LEFT JOIN usuariospush AS u ON (u.usuarioPushId = mu.usuarioPushId)