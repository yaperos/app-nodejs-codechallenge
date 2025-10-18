// Setup environment variables for tests
process.env.KAFKA_BROKERS = "localhost:9092";
process.env.KAFKA_CLIENT_ID = "antifraud-test";
process.env.KAFKA_TRANSACTION_TOPIC = "transaction.created";
process.env.KAFKA_STATUS_TOPIC = "transaction.status";
process.env.KAFKA_CONSUMER_GROUP_ANTIFRAUD = "antifraud-group";
process.env.NODE_ENV = "test";
