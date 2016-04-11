SELECT c.codsocio, c.codcampo, nomvarie, 
nomparti, poligono, parcela, recintos,
COALESCE(k.kilos,0) AS kilostot,
h.numalbar, h.fecalbar, numcajon, kilosnet
FROM rcampos AS c
LEFT JOIN variedades AS v ON v.codvarie = c.codvarie
LEFT JOIN rpartida AS p ON p.codparti = c.codparti
LEFT JOIN (SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta GROUP BY codcampo) AS k ON k.codcampo = c.codcampo
LEFT JOIN rhisfruta AS h ON h.codcampo = c.codcampo
WHERE c.fecbajas IS NULL 
AND c.codsocio = 4095;


SELECT codcampo, SUM(kilosnet) AS kilos FROM rhisfruta WHERE codcampo = 5602 GROUP BY codcampo;

SELECT COUNT(*) FROM rcampos WHERE fecbajas IS NULL

