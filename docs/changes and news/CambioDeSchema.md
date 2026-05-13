Con el cambio de Long por UUID, se tiene que tirar la base de datos y volver a generar la imagen del backend.

1. Borrar la bd
`docker compose down -v`

2. Levantar solo la BD
`docker compose up -d db`

3. Borrar la imagen del backend
`cd backend`
`mvn clean test`

4. En caso de pasar los test recrear la imagen
`mvn clean package`

5. Recrear compose con el backend
`cd ..`
`docker compose down`
`docker compose up -d --build`
