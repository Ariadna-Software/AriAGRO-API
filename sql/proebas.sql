UPDATE mensajes AS m, mensajes_usuariospush AS mu
SET m.estado = 'PREPARADO', mu.estado = 'PREPARADO'
WHERE m.mensajeId = 57 AND mu.mensajeId = 57;