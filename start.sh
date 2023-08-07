#!/bin/bash

# check if docker engine is running
echo "[start script] - Checking if docker engine is running..."
docker ps > /dev/null 2>&1 || { echo >&2 "[start script] - Docker engine is not running. Please start it and try again."; exit 1; }

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

echo "[start script] - Starting third party services..."
docker-compose up -d kafka1 kafka2 kafka3 mongodb
echo "[start script] - Third party services started"

# check if kafka is up and running (3 nodes) (if each takes more than 15 seconds, increase the number of retries)
echo "[start script] - Waiting for kafka to be up and running..."
docker-compose exec kafka1 bash -c "kafka-topics --list --zookeeper zookeeper:2181" > /dev/null 2>&1
echo "[start script] - Kafka is up and running (1/3)"
docker-compose exec kafka2 bash -c "kafka-topics --list --zookeeper zookeeper:2181" > /dev/null 2>&1
echo "[start script] - Kafka is up and running (2/3)"
docker-compose exec kafka3 bash -c "kafka-topics --list --zookeeper zookeeper:2181" > /dev/null 2>&1
echo "[start script] - Kafka is up and running (3/3)"

# check if mongodb is up and running
echo "[start script] - Waiting for mongodb to be up and running..."
docker-compose exec mongodb bash -c "mongo --eval 'db.runCommand({ connectionStatus: 1 })'" > /dev/null 2>&1
echo "[start script] - Third party services are up and running"

# start the containers of the projects
echo "[start script] - Starting the docker containers of the projects $PROJECT_NAME_TRANSACTION and $PROJECT_NAME_ANTIFRAUD..."
docker-compose up -d --build $PROJECT_NAME_TRANSACTION $PROJECT_NAME_ANTIFRAUD
echo "[start script] - Docker containers of the projects $PROJECT_NAME_TRANSACTION and $PROJECT_NAME_ANTIFRAUD started"

echo "[start script] - Running the docker containers..."