#! /bin/bash

# create topic
docker exec yp_kafka kafka-topics --bootstrap-server kafka:9092 --create --topic db-write-event-topic

# delete topic
docker exec yp_kafka kafka-topics --bootstrap-server kafka:9092 --delete --topic db-write-event-topic

# list topics
docker exec yp_kafka kafka-topics --bootstrap-server kafka:9092 --list

# write
docker exec -it yp_kafka bash
kafka-console-producer --bootstrap-server kafka:9092 --topic db-write-event-topic

# read
docker exec -it yp_kafka bash
kafka-console-consumer --bootstrap-server kafka:9092 --topic db-write-event-topic
kafka-console-consumer --bootstrap-server kafka:9092 --topic db-write-event-topic --from-beginning
