#!/bin/bash

max_retries=5
retry_count=0

until [ $retry_count -ge $max_retries ]
do
  kafka-topics --create --topic transactions --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 && break
  retry_count=$((retry_count+1)) 
  sleep 5
done