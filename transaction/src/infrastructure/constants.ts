import * as dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.PORT || 4000;
export const APP_HOST = process.env.APP_HOST || '0.0.0.0';
export const COMMAND_DATABASE_CONNECTION: string = process.env.COMMAND_DATABASE_CONNECTION || 'command_mongodb';
export const COMMAND_DATABASE_URL: string = process.env.COMMAND_DATABASE_URL || 'mongodb://localhost:27017/transactionAccount';
export const COMMAND_DATABASE_SCHEMA: string = process.env.COMMAND_DATABASE_SCHEMA || 'transactions';
export const TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION: string =  process.env.TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION ||'transaction-status';
export const TOPIC_KAFKA_SEND_TRANSACTION: string =  process.env.TOPIC_KAFKA_SEND_TRANSACTION ||'transaction-created';
export const KAFKA_GROUP_ID: string =  process.env.KAFKA_GROUP_ID ||'transaction-consumer';
export const KAFKA_CLIENT_ID: string =  process.env.KAFKA_CLIENT_ID || 'my-transaction-app';
export const KAFKA_BROKERS: string =  process.env.KAFKA_BROKERS ||'localhost:9092';