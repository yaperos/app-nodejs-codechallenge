#!/usr/bin/env bash
set -euo pipefail

BOOTSTRAP="${BOOTSTRAP_SERVER:-kafka:29092}"

echo "Waiting for Kafka at ${BOOTSTRAP}..."
for i in {1..120}; do
  if kafka-topics --bootstrap-server "$BOOTSTRAP" --list >/dev/null 2>&1; then
    echo "Kafka is ready."
    break
  fi
  sleep 1
done

# Si después de 120s no estuvo listo, fallamos explícito
kafka-topics --bootstrap-server "$BOOTSTRAP" --list >/dev/null 2>&1 || {
  echo "Kafka did not become ready in time"
  exit 1
}

create_topic () {
  local topic="$1"
  local partitions="${2:-3}"
  local rf="${3:-1}"

  if kafka-topics --bootstrap-server "$BOOTSTRAP" --describe --topic "$topic" >/dev/null 2>&1; then
    echo "Topic already exists: $topic"
  else
    echo "Creating topic: $topic (partitions=$partitions, rf=$rf)"
    kafka-topics --bootstrap-server "$BOOTSTRAP" \
      --create --topic "$topic" \
      --partitions "$partitions" \
      --replication-factor "$rf"
  fi
}

create_topic "transaction.created" 3 1
create_topic "transaction.validated" 3 1
create_topic "transaction.created.dlt" 3 1
create_topic "transaction.validated.dlt" 3 1

echo "Topics created/verified OK:"
kafka-topics --bootstrap-server "$BOOTSTRAP" --list
