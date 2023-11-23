#!/bin/bash
docker-compose exec kafka usr/bin/kafka-console-consumer \
  --topic $0 \
  --bootstrap-server kafka:9092

