#!/bin/bash
docker-compose exec kafka /usr/bin/kafka-console-producer \
  --topic $0 \
  --broker-list kafka:9092
