#!/bin/bash



# Verifica si Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "Docker no está instalado. Por favor, instala Docker para ejecutar este script."
    exit
fi
# Ejecuta docker-compose up --build -d en la raíz del proyecto
docker-compose up --build -d

# Verifica si el servicio db-postgres está corriendo
if ! docker-compose ps -q db-postgres &> /dev/null
then
    echo "El servicio db-postgres no está corriendo. Por favor, inicia tu entorno Docker Compose."
    exit
fi

# Crea la base de datos yape_challenge
docker-compose exec -T db-postgres psql -U postgres -c "CREATE DATABASE yape_challenge"

echo "Base de datos yape_challenge creada exitosamente."

# Verifica si el servicio ms-transaction está corriendo
if ! docker-compose ps -q ms-transaction &> /dev/null
then
    echo "El servicio ms-transaction no está corriendo. Por favor, inicia tu entorno Docker Compose."
    exit
fi

# Ejecuta el comando npx prisma migrate deploy en el servicio ms-transaction
docker-compose exec -T ms-transaction npx prisma migrate deploy

echo "Comando npx prisma migrate deploy ejecutado en el servicio ms-transaction."