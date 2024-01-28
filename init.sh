#!/bin/bash

DOCKER_COMPOSE_FILE=./docker-compose.yml

run_docker_compose() {
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
}

DIR_MS_TRANSACTION=/ms-transaction
DIR_MS_ANTIFRAUDE=/ms-anti-fraud

cd "$DIR_MS_TRANSACTION"
echo "Instalando dependencias para ms-transaction"
npm install
npm run start:dev

cd ..

cd "$DIR_MS_ANTIFRAUDE"

echo "Instalando dependencias para ms-antifraud"
npm install
npm run start:dev