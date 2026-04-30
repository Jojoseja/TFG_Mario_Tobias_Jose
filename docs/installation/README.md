# English

## Docker compose install
1. Download & install docker and docker compose
2. Download the project from github
3. Navigate to the root folder of the project
4. Create and modify a .env from the .env.sample file
5. To execute the whole project use `docker compose up -d --build` 
6. This will create a docker service, the `-d` means it will run in the background, the `--build` will build the images from source

## Docker compose stopping and uninstalling
1. To stop the whole service use `docker compose down`
2. If you want to remove the volumes while doing so use `docker compose down -v`
3. To remove every thing use `docker compose rm -v`

## Install without docker 
It is discouraged to run the app this way, in case just one service is needed remove the unnecessary services from the docker-compose.yml
As per requirements it will be necessary to install java21, maven, node and npm

### Backend
It will be necessary to add a datasource for the database, the default settings are for postgre

1. Navigate to the /backend folder and use `mvn clean package` to build an executable .jar
2. Navigate to /target and use `java -jar [package.jar]` where 'package' is the name of the .jar

### Frontend
1. Navigate to the /frontend folder and use `npm install` to install the dependencies
2. To run the frontend use `npm run dev` and navigate to http://localhost:5173 on the browser

# Español

## Instalación con docker compose
1. Descargar e instalar docker y docker compose
2. Descargar el proyecto de github
3. Navegar a la carpeta raíz
4. Crea y modifica un archivo .env basándote en el .env.sample
5. Para ejecutar el proyecto entero usa `docker compose up -d --build`
6. Creará un servicio docker enlazado, el `-d` permite que se ejecute de fondo y `--build` construye las imágenes del backend y frontend

## Desinstalar y detener el docker compose
1. Para detener el servicio usar `docker compose down`
2. Para detener el servicio y eliminar los volúmenes usar `docker compose down -v`
3. Para eliminar además todo el compose usar `docker compose rm -v`

## Instalación sin docker
Se recomienda la instalación con docker compose para evitar problemas de compatiblidad
Se necesita de java21, maven, node y npm

### Backend
Se requiere de una conexión a base de datos tipo postgresql

1. Navegar a la carpeta /backend y usar `mvn clean package` para generar el .jar
2. Navegar a /target y usar `java -jar [package.jar]` donde package es el nombre del .jar que hemos creado en el paso anterior

### Frontend
1. Navegar a la carpeta /frontend y usar `npm install` para descargar las dependencies
2. Para ejecutar el frontend usar `npm run dev` y navegar a http://localhost:5173
