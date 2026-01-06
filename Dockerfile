FROM confluentinc/cp-kafka-connect:7.5.0

RUN confluent-hub install --no-prompt debezium/debezium-connector-postgresql:2.4.2

RUN ls -la /usr/share/confluent-hub-components/

USER appuser