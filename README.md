# UFPS-Training-center-deploy

Repositorio para el despliegue en modo producción de la plataforma UFPS Training center.

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
- FRONTEND_PORT: Puerto que se utilizara para exponer el frontend en el servidor.
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
| training-center-backend  | backend  |
| training-center-frontend  | frontend  |

## Despliegue en modo desarrollo

Para ejecutar los proyectos en modo desarrollo, recomendamos hacer uso de los siguientes respositorios:

- [Backend](https://github.com/Meyito/training-center-ufps)
- [Frontend](https://github.com/GersonLazaro/UFPS-Training-Center-Frontend)
- [Calificador](https://github.com/Meyito/docker-grading)

Cada uno de estos cuenta con sus propias instrucciones de instalación.

## Información adicional

El proyecto se encuentra desplegado en [ufpstrainingcenter.com](http://ufpstrainingcenter.com/#/iniciar-sesion)

Para más información acerca del proyecto, por favor visitar nuestra [documentación oficial](http://ufpstrainingcenter.com/anexos/) 

Para más información del grupo de estudio por favor visitar nuestros [repositorios](https://github.com/ProgramacionCompetitivaUFPS)



Este proyecto fue construido con mucho :heart: y Javascript por [Melissa](https://github.com/Meyito) y [Gerson](https://github.com/GersonLazaro)
