/*
Incluir las columnas applogin y apppassword para la autentificación de usuarios
en la app móvil
 */

 ALTER TABLE `ariagro`.`rsocios`   
  ADD COLUMN `applogin` VARCHAR(255) NULL AFTER `emitefact`,
  ADD COLUMN `apppassword` VARCHAR(255) NULL AFTER `applogin`;
