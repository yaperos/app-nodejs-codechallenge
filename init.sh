#!/bin/bash
echo "Start: Sleep 30 seconds"
sleep 30;
# Creando el topic 'transactionStatusTopic'
echo "Creando el topic 'transactionStatusTopic'..."
kafka-topics --create --if-not-exists --zookeeper zookeeper:2181 --partitions 1 --replication-factor 1 --topic transactionStatusTopic
echo "topic 'transactionStatusTopic' creado"

# Comando de espera infinita para mantener el contenedor en ejecución
tail -f /dev/null