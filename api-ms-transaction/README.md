<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Desarrollo
1. Clonar el repositorio
2. Ejecutar
```
  npm install
```
3. Tener nest cli instalado
```
  npm i -g @nestjs/cli
```
4. Levantar la base de datos y kafka
```
  docker-compose up -d
```
5. Clonar el archivo ```.env.template``` y renombrar la copia ```.env```
6. Llenar las variables de entorno definidas en el ```.env```
7. Reconstruir la base de datos -> Seguir los pasos del repositorio core-data-model

# Stack
* PostgresSQL
* Nest
* Docker
* Grpc