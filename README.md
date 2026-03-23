# TFG_Mario_Tobias_Jose
Proyecto para el TFG
1. Hacer paquete del backend con:
`cd backend`
`m̀vn clean package -DskipTests`

2. Iniciar docker compose
`cd ..`
`docker compose up --build backend -d`
el -d es para correrlo de fondo

3. Detener el docker compose
`docker compose down`

4. Iniciar solo la base de datos
`docker compose up db -d`

5. Iniciar tests en el backend
`cd backend`
`mvn clean test`
