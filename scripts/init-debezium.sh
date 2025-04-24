#!/bin/bash

echo "Waiting for Kafka Connect to start..."

max_wait=20
elapsed=0

while ! nc -z localhost 8083; do
  sleep 5
  elapsed=$((elapsed + 5))
  if [ "$elapsed" -ge "$max_wait" ]; then
    echo "Kafka Connect did not start within 120 seconds. Exiting."
    exit 1
  fi
done

echo "Kafka Connect is up. Configuring Debezium connector..."

curl -X POST -H "Content-Type: application/json" \
  --data-binary "@../docker/debezium/transactions-connector.json" \
  http://localhost:8083/connectors

echo "Checking connector status (wait a few seconds for initialization)..."
sleep 10
curl -X GET http://localhost:8083/connectors/transactions-postgres-connector/status

echo "Debezium configuration attempted."
