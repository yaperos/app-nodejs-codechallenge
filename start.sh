#!/bin/bash

echo "[start script] - Setting up the project names..."
PROJECT_NAME_TRANSACTION=njs-nest-transaction
PROJECT_NAME_ANTIFRAUD=njs-nest-antifraud

echo "[start script] - Setting up the environment variables..."
PROJECT_NAMES=($PROJECT_NAME_TRANSACTION $PROJECT_NAME_ANTIFRAUD)

echo "[start script] - Setting up the build script..."
chmod +x build.sh

# iterate in parallel through the project names and build them
echo "[start script] - Building the projects..."
for PROJECT_NAME in "${PROJECT_NAMES[@]}"
 do
		echo "[start script] - Building the project $PROJECT_NAME..."
		./build.sh $PROJECT_NAME
 done
echo "[start script] - Projects ($PROJECT_NAMES) built"

echo "[start script] - Building the docker images..."
#docker-compose up -d --build
echo "[start script] - Docker images built"

echo "[start script] - Running the docker containers..."