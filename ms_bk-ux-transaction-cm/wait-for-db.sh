#!/bin/sh

# Espera a que el puerto 5432 en postgres-query esté disponible
until nc -z postgres-command 5432; do
  echo "Esperando a que postgres-command esté listo..."
  sleep 2
done

echo "Base de datos disponible! Ejecutando migraciones..."
npx prisma migrate dev --name init && npx prisma generate
