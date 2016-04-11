SELECT 
f.codtipom, t.nomtipom,
t.letraser, f.numfactu, CONCAT(t.letraser, "-", f.numfactu) AS factura,
f.fecfactu, f.baseimpo, f.imporiva, f.impreten, f.totalfac,
v.nomvarie,
l.kilosnet, l.imporvar
FROM rfactsoc AS f
LEFT JOIN usuarios.stipom AS t ON t.codtipom = f.codtipom
LEFT JOIN rfactsoc_variedad AS l ON l.codtipom = f.codtipom AND l.numfactu = f.numfactu AND l.fecfactu = f.fecfactu
LEFT JOIN variedades AS v ON v.codvarie = l.codvarie