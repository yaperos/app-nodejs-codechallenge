import { env } from 'process';
import dotenv from 'dotenv';
import { Environment } from '@core/config/types';
dotenv.config();

export const environment: Environment = {
  kafkaHost: `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  kafkaGroupId: env.KAFKA_GROUPID,
  transactionLimit: parseInt(env.TRANSACTION_LIMIT),
  transactionKafkaConfig: {
    host: `${env.TRANSACTION_KAFKA_HOST}:${env.TRANSACTION_KAFKA_PORT}`,
    name: env.TRANSACTION_KAFKA_NAME,
    clientId: env.TRANSACTION_KAFKA_CLIENTID,
    groupId: env.TRANSACTION_KAFKA_GROUPID,
  },
};
