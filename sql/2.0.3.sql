ALTER TABLE `aripush`.`mensajes`   
  ADD COLUMN `administradorId` INT(11) NULL AFTER `pushId`;

  ALTER TABLE `aripush`.`mensajes`  
  ADD CONSTRAINT `mensajes_administradoresFk` FOREIGN KEY (`administradorId`) REFERENCES `aripush`.`administradores`(`administradorId`) 
  ON UPDATE CASCADE ON DELETE NO ACTION;
