INSERT INTO aripush.usuariospush(nif, nombre, login, PASSWORD, ariagroId, telefoniaId, tiendaId, gasolineraId, email)
SELECT
COALESCE(agr.nifsocio, tie.nifclien, tel.nifclien, gas.nifsocio) AS nif,
COALESCE(agr.nomsocio, tie.nomclien, tel.nomclien, gas.nomsocio) AS nombre,
COALESCE(agr.codsocio, agr.nifsocio, tie.nifclien, tel.nifclien, gas.nifsocio) AS login,
COALESCE(agr.codsocio, tel.codclien, tie.codclien, gas.codsocio) AS PASSWORD,
agr.codsocio AS ariagroId,
tel.codclien AS telefoniaId,
tie.codclien AS tiendaId,
gas.codsocio AS gasolineraId,
COALESCE(agr.maisocio, tie.maiclie1, tel.maiclie1, gas.maisocio) AS email
FROM 
ariges.asociados AS ges
LEFT JOIN ariagro.rsocios AS agr ON agr.codsocio = ges.codsoceuroagro
LEFT JOIN ariges1.sclien AS tel ON tel.codclien = ges.idasoc
LEFT JOIN ariges3.sclien AS tie ON tie.codclien = ges.idasoc
LEFT JOIN arigasol.ssocio AS gas ON gas.codsocio = ges.idasoc
WHERE NOT COALESCE(agr.nifsocio, tie.nifclien, tel.nifclien, gas.nifsocio) IS NULL;

SELECT * FROM aripush.usuariospush WHERE ariagroId NOT IN (SELECT codsocio FROM ariagro.rsocios)



SELECT COUNT(*) FROM ariges.asociados WHERE codsoceuroagro IS NULL;
SELECT COUNT(*) FROM ariagro.rsocios;
SELECT * FROM ariges.asociados;

DELETE FROM aripush.usuariospush;
