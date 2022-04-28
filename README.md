# AriAgroApi


## Parámetros del fichero de configuración
Se utiliza un fichero de configuración tipo .env con el siguiente significado para cada parámetro.
### Configuracion general  
**API_PORT**= Indica el puerto en el que escuchará la api  
**API_HOST**= Servidor en el que arranca la api  
**FICHEROS**= Directorio local en el que se encuentran los ficheros  
**REPORTS_DIR**= Directorio a usar para los informes  
**CLASIF_DIR**= Directorio local para clasificación  
**JSON_DIR**= Directorio en el que se guardan los ficheros JSON  
**STI_KEY**= Clave de licencia de STIREPORT  


### Configuracion correo  
**EMAIL_HOST**= Servidor smtp del correo electrónico  
**EMAIL_PORT**= Puerto smtp del servidor  
**EMAIL_SECURE**= Utilza comunicaciones encriptadas (true/false)  
**EMAIL_USER**= Usuario del correo  
**EMAIL_PASS**= Contraseña del correo  
**EMAIL_DESTINATARIO**= Dirección de correo a la que se le enviarán las notificaciones  

### Configuracion mysql  

**SERVER**= Dirección del servidor MYSQL por defecto  
**PORT**= Puerto de MYSQL  
**USER**= Usuario de MYSQL  
**PASSWORD**= Contraseña del usuario MYSQL   

### Configuración ariagro
**ARIAGROSERVER**= Dirección del servidor MYSQL para ariagro  
**ARIAGROPORT**=  
**ARIAGROUSER**=  
**ARIAGROPASSWORD**=  
**ARIAGRODATABASE**=  

### Configuración de usuarios y mensajes para móviles
**USUARIOS_SERVER**=Dirección del servidor MYSQL para usuarios  
**USUARIOS_PORT**=  
**USUARIOS_USER**=  
**USUARIOS_PASSWORD**=  
**USUARIOS_DATABASE**=  
 
### Configuración del acceso a GESSOCIAL (Solo aplicable en el caso de ALZICOOP)
**GESSOCIAL_SERVER**=Dirección del servidor MYSQL para gestiçon social  
**GESSOCIAL_PORT**=  
**GESSOCIAL_USER**=  
**GESSOCIAL_PASSWORD**=  
**GESSOCIAL_DATABASE**=  
 
### Configuración para la consulta de facturas de tienda 
**TIENDA_SERVER**=Dirección del servidor MYSQL para facturas de tienda  
**TIENDA_PORT**=  
**TIENDA_USER**=  
**TIENDA_PASSWORD**=  
**TIENDA_DATABASE**=  
**TIENDA_TIPO_FACT**=["FAV"] // código de tipo de las facturas de esa categoría   
 
### Configuración para la consulta de las facturas de telefonía
**TELEFONIA_SERVER**=Dirección del servidor MYSQL para telefonía  
**TELEFONIA_PORT**=  
**TELEFONIA_USER**=  
**TELEFONIA_PASSWORD**=  
**TELEFONIA_DATABASE**=  
**TELEFONIA_TIPO_FACT**=["FMO"] // código de tipo de las facturas de esa categoría   

### Configuración para la consulta de las facturas de gasolinera
**GASOLINERA_SERVER**=Dirección del servidor MYSQL para las facturas de gasolinera.  
**GASOLINERA_PORT**=  
**GASOLINERA_USER**=  
**GASOLINERA_PASSWORD**=  
**GASOLINERA_DATABASE**=  

### Configuración de acceso a la base de datos para usuarios móviles
**PUSH_SERVER**=Dirección del servidor MYSQL para los datos de notificaciones a los usuarios de las aplicaciones móviles  
**PUSH_PORT**=  
**PUSH_USER**=  
**PUSH_PASSWORD**=  
**PUSH_DATABASE**=  
 
### Configuración para la consulta de las facturas de tratamientos
**TRATAMIENTOS_SERVER**=Dirección del servidor MYSQL para las facturas de tratamientos en campo (ADV)  
**TRATAMIENTOS_PORT**=  
**TRATAMIENTOS_USER**=  
**TRATAMIENTOS_PASSWORD**=  
**TRATAMIENTOS_DATABASE**=  
**TRATAMIENTOS_TIPO_FACT**=["FAS", "FTE"] // código de tipo de las facturas de esa categoría

### Configuración para el acceso a las facturas de aceite
**ACEITE_SERVER**=Dirección del servidor MYSQL para las facturas de ACEITE  
**ACEITE_PORT**=  
**ACEITE_USER**=  
**ACEITE_PASSWORD**=  
**ACEITE_DATABASE**=  
**ACEITE_TIPO_FACT**=Código de tipo de las facturas de esa categoría (en el caso del aceite no es aplicable)  

### Otras configuraciones aplicables
**CAMPANYA_UNICA**=Los posibles valores son S o N (Si S solo hay una base de datos ariagro si N hay un ariagro por campaña)  
**ARIADNA_S2_URL**=Dirección en la que está escuchando el servicio S2 que se encarga de la generación de las facturas en PDF y su envío por correo  


