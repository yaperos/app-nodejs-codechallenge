# Desplegar con Docker-compose

## Envs

En los proyectos, puedes duplicar .env.example a .env (De la raiz del proyecto) para ejecutar el
proyecto localmente

## Correr Docker-compose

Corre instancias de kafka y mongodb

```
docker-compose up --build -d
```

## Para Nest-Transaction

Instalar las dependencias y luego correr en modo dev

```
cd ./api-gateway

npm install
npm run start:dev
```

Esto levatará el proyecto en el puerto 3000

## Para Nest-Antifraud

Instalar las dependencias y luego correr en modo dev

```
cd ./microservice

npm install
npm run start:dev
```
