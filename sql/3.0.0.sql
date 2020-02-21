CREATE TABLE `aripush`.`recursos` (  
  `recursoId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `url` VARCHAR(255),
  PRIMARY KEY (`recursoId`)
);

ALTER TABLE `aripush`.`parametros`   
	ADD COLUMN `bucket` VARCHAR(255) NULL AFTER `gcm`,
	ADD COLUMN `bucket_region` VARCHAR(255) NULL AFTER `bucket`,
	ADD COLUMN `bucket_folder` VARCHAR(255) NULL AFTER `bucket_region`,
	ADD COLUMN `identity_pool` VARCHAR(255) NULL AFTER `bucket_folder`;
