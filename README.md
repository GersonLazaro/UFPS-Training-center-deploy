# UFPS-Training-center-deploy

## Requisitos 

- Docker CE
- Docker compose

## Volumen

Para poder ejecutar el proyecto se deben crear los siguientes directorios:

- files
- files/inputs
- files/outputs
- files/materials
- files/codes

En estos directorios se almacenaran todos los archivos para el correcto funcionamiento de la plataforma.

## Variables de entorno

Crear un archivo .env (se puede tomar como base en archivo .env.example que se encuentra en este repositorio) y configurar las siguientes variables:

- FILES: Ruta a la carpeta files (creada en el paso anterior).
- MYSQL_PASSWORD: Contraseña para el usuario root de la base de datos.
- DATABASE_URL: String para la conexión a la base de datos en el siguiente formato mysql://<username>:<password>@<host>/<database>?reconnect=true

## Ejecutar los contenedores

Para levantar todos los contenedores se debe ejecutar el siguiente comando:

```
docker-compose up -d
```

Si se desea ejecutar solo uno de los contenedores se debe ejecutar el siguiente comando:

```
sudo docker run -d -i -v ${FILES}:/files --name <nombre-contenedor> <nombre-imagen>
```

## Contenedores e imagenes

El proyecto UFPS Training Center cuenta con los siguientes repositorios e imagenes docker:

| Contenedor  | Imagen base |
| ------------- | ------------- |
| cppSandbox  | cpp_image  |
| javaSandbox  | java_image  |
| pythonSandbox  | python_image  |
| mariaDB  | mariadb:10.2  |
| training-center-backend  |   |
| training-center-frontend  |   |



