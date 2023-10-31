#!/bin/bash

# Espera a que Kafka esté listo antes de crear los topics
echo "Esperando a Kafka para iniciar..."
cub kafka-ready -b kafka:29092 1 60

# Crea los topics
kafka-topics --create --if-not-exists --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic transaction.created
kafka-topics --create --if-not-exists --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic transaction.approved
kafka-topics --create --if-not-exists --zookeeper zookeeper:2181 --replication-factor 1 --partitions 10 --topic transaction.rejected

echo "Topics creados."
