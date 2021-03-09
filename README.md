# RM API

Explicaremos como crear la api de base para todos los proyectos. Se utilizaran las siguientes tecnologias.
- NodeJS
- ExpressJS
- Mongodb
- MySQL
- Docker 

### Requisitos
Es necesario, tener instalado en nuestra PC las siguientes herramientas.

1. nodejs & npm
2. git
3. mysql
4. docker.io
5. mongodb


### Pasos

1. Creamos la carpeta del proyecto
`$ mkdir name-of-project`

2. iniciamos package.json
`$ npm init`

	Una vez generado con los datos que solicita modificamos las siguientes lineas: 

	```json 
		{
			"scripts": {
				"start": "nodemon ./index.js"
				"seed_user": "node ./bin/seed_user.js"
			},
		  "author": {
				"name": "Ramiro Macciuci",
				"email": "ramimacciuci@gmail.com",
				"url": "https://ramiromacciuci.com.ar"
		  },
		}
	```
3. iniciamos el repositorio de GIT luego de haberlo creado en la web donde lo alojaremos
	`$ git init`

4. Clonamos el siguiente repositorio

	`$ git clone https://github.com/Rmacciuci/api-base-rm`