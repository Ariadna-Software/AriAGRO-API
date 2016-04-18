SELECT fc.codsocio, fc.letraser, fc.numfactu, fc.fecfactu, 
(COALESCE(fc.baseimp1,0) + COALESCE(fc.baseimp2,0) + COALESCE(fc.baseimp3,0)) AS bases,
(COALESCE(fc.impoiva1,0) + COALESCE(fc.impoiva2,0) + COALESCE(fc.impoiva3,0)) AS cuotas,
fc.impuesto, fc.totalfac,
fl.numlinea, fl.numalbar, fl.fecalbar, 
a.nomartic, fl.cantidad, fl.preciove, fl.implinea
FROM schfac AS fc
LEFT JOIN slhfac AS fl ON fl.letraser = fc.letraser AND fl.numfactu = fc.numfactu AND fl.fecfactu = fc.fecfactu
LEFT JOIN sartic AS a ON a.codartic = fl.codartic
WHERE fc.codsocio = 6567;
