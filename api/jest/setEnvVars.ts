// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.env.KAFKA_FIRST_BROKER = 'localhost:9092';
process.env.KAFKA_CLIENT_ID = 'any_client_id';
process.env.KAFKA_UPDATE_TRANSACTION_TOPIC = 'any_update_transaction_topic';
process.env.KAFKA_VALIDATE_TRANSACTION_TOPIC = 'any_validate_transaction_topic';
process.env.CONSUMER_TRANSACTION_API_GROUP_ID = 'any_group_id';
