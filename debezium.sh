curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '{
  "name": "transaction-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max":"1",
    "plugin.name": "pgoutput",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "transaction-db",
    "database.server.name": "localhost",
    "tombstones.on.delete": "false",
    "table.include.list": "public.outbox",
    "slot.name": "transaction_slot",
    "skipped.operations": "u,d,t",
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.route.by.field" : "eventname",
    "transforms.outbox.route.topic.replacement": "${routedByValue}.EVENT",
    "value.converter.delegate.converter.type.schemas.enable": "false",
    "value.converter":"io.debezium.converters.ByteBufferConverter",
    "value.converter.delegate.converter.type":"org.apache.kafka.connect.json.JsonConverter",
    "transforms.outbox.table.expand.json.payload":"true"
  }
}'

curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '{
  "name": "anti-fraud-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max":"1",
    "plugin.name": "pgoutput",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "antifraud-db",
    "database.server.name": "localhost",
    "tombstones.on.delete": "false",
    "table.include.list": "public.outbox",
    "slot.name": "antifraud_slot",
    "skipped.operations": "u,d,t",
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.route.by.field" : "eventname",
    "transforms.outbox.route.topic.replacement": "${routedByValue}.EVENT",
    "value.converter.delegate.converter.type.schemas.enable": "false",
    "value.converter":"io.debezium.converters.ByteBufferConverter",
    "value.converter.delegate.converter.type":"org.apache.kafka.connect.json.JsonConverter",
    "transforms.outbox.table.expand.json.payload":"true"
  }
}'