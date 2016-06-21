/*
SQLyog Community v12.2.1 (64 bit)
MySQL - 5.6.16 : Database - aripush
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `aripush`;

/*Table structure for table `administradores` */

DROP TABLE IF EXISTS `administradores`;

CREATE TABLE `administradores` (
  `administradorId` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`administradorId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `administradores` */

insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (1,'admin','admin','admin','adm@gmail.com');
insert  into `administradores`(`administradorId`,`nombre`,`login`,`password`,`email`) values (2,'Pedro','pedro','pedro','pedro@gmail.com');

/*Table structure for table `mensajes` */

DROP TABLE IF EXISTS `mensajes`;

CREATE TABLE `mensajes` (
  `mensajeId` int(11) NOT NULL AUTO_INCREMENT,
  `asunto` varchar(255) DEFAULT NULL,
  `texto` text,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `pushId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mensajeId`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8;

/*Data for the table `mensajes` */

/*Table structure for table `mensajes_usuariospush` */

DROP TABLE IF EXISTS `mensajes_usuariospush`;

CREATE TABLE `mensajes_usuariospush` (
  `mensajeId` int(11) NOT NULL,
  `usuarioPushId` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`mensajeId`,`usuarioPushId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `mensajes_usuariospush` */

/*Table structure for table `parametros` */

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE `parametros` (
  `parametroId` int(11) NOT NULL,
  `tituloPush` varchar(255) DEFAULT NULL,
  `appId` varchar(255) DEFAULT NULL,
  `restApi` varchar(255) DEFAULT NULL,
  `gcm` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`parametroId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `parametros` */

insert  into `parametros`(`parametroId`,`tituloPush`,`appId`,`restApi`,`gcm`) values (0,'ARIAGRO','33728f44-2576-4f76-9b7c-b6a65d345c28','YzY4MDc1MjEtNjZlZi00MDcxLWE2YzgtZDFmNWYyOTU4NmI4','595606821946');

/*Table structure for table `usuariospush` */

DROP TABLE IF EXISTS `usuariospush`;

CREATE TABLE `usuariospush` (
  `usuarioPushId` int(11) NOT NULL AUTO_INCREMENT,
  `nif` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `comunId` int(11) DEFAULT NULL,
  `ariagroId` int(11) DEFAULT NULL,
  `tiendaId` int(11) DEFAULT NULL,
  `gasolineraId` int(11) DEFAULT NULL,
  `telefoniaId` int(11) DEFAULT NULL,
  `tratamientosId` int(11) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `playerId` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codPostal` varchar(255) DEFAULT NULL,
  `poblacion` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `telefono1` varchar(255) DEFAULT NULL,
  `telefono2` varchar(255) DEFAULT NULL,
  `iban` varchar(255) DEFAULT NULL,
  `soloMensajes` tinyint(1) DEFAULT '0',
  `esTrabajador` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`usuarioPushId`)
) ENGINE=InnoDB AUTO_INCREMENT=23644 DEFAULT CHARSET=utf8;

/*Data for the table `usuariospush` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
