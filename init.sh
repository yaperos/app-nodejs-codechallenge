#!/bin/bash

# Iniciar contenedores con Docker Compose
docker-compose up -d
docker-compose exec ms-modify-transactions npm run migrate
