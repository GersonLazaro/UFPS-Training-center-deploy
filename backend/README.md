# training-center

[![Build Status](https://travis-ci.org/Meyito/training-center-ufps.svg?branch=master)](https://travis-ci.com/Meyito/training-center-ufps)
[![dependencies Status](https://david-dm.org/Meyito/training-center-ufps.svg)](https://david-dm.org/Meyito/training-center-ufps)
[![Github Issues](https://img.shields.io/github/issues/Meyito/training-center-ufps.svg)](http://github.com/Meyito/training-center-ufps/issues)


## PRODUCCIÓN

Los Sprints cerrados se encuentran desplegados en: [Heroku](https://ufps-tc.herokuapp.com/)

## Ejecutar el proyecto en Local

### Requisitos

* MariaDB
* node
* npm
* sequelize-cli

Cambiar a la ubicación del proyecto

```
$ cd /training-center-ufps/
```

En el archivo de configuraciones *config.js* cambiar los datos de conexión a la base de datos de desarrollo y de test.

Instalar las dependencias
```
$ npm install
```
Ejecutar las migraciones de la BD (Sequelize).

Ejecutar el proyecto
```
$ npm start
```

En el navegador:`localhost:3000`

## SEQUELIZE

Training Center UFPS utiliza Sequelize como ORM. Para más información consulte [Sequelize CLI](https://github.com/sequelize/cli)

### Migraciones

Para ejecutar las Migraciones dentro de la raiz del proyecto: 

```
$ sequelize db:migrate
```

### Seeds

Para ejecutar los seeds:

```
$ sequelize db:seed:undo:all
$ sequelize db:seed:all
```

## RESTful API

## TEST

Ejecutar en local. 

Instalar mocha de manera global
```
$ npm install -g mocha
```

Añadir en el Package.json el siguiente script:
```
"scripts": {
    "start": "nodemon ./bin/www",
    "test": "mocha"
  },
```

Luego de esto, ejecutar: 

```
$ sequelize db:seed:undo:all
$ sequelize db:seed:all
$ npm test
```

## To Do
- [] Get contest scoreboard
- [] Get profile
- [] Update profile
- [] Get syllabus scoreboard
- [] Get my submissions
- [] Get general ranking
- [] List users for admin
- [] Delete account (admin)
- [] Verificar el estado de los dockers, en caso de que esten abajo y suban enviar a calificar automaticamente todos aquellos envios que se encuentren en estado "in queue"
- [] Docker compose
- [] Deploy
- [] SEEDS
- [] MAIL

## Improvements
- [] Redis para socket.io
- [] Redis para blacklist tockens

 Build with :heart: by Meyito
