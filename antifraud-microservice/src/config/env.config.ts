import { env } from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

type Environment = {
  environment: () => string;
  kafkaHost: () => string;
  kafkaGroupId: () => string;
  transactionLimit: () => number;
  transactionKafkaConfig: () => {
    host: string;
    name: string;
    clientId: string;
    groupId: string;
  };
};

export const EnvConfig: Environment = {
  environment: () => env.ENVIRONMENT,
  kafkaHost: () => `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  kafkaGroupId: () => env.KAFKA_GROUPID,
  transactionLimit: () => Number(env.TRANSACTION_LIMIT),
  transactionKafkaConfig: () => ({
    host: `${env.TRANSACTION_KAFKA_HOST}:${env.TRANSACTION_KAFKA_PORT}`,
    name: env.TRANSACTION_KAFKA_NAME,
    clientId: env.TRANSACTION_KAFKA_CLIENTID,
    groupId: env.TRANSACTION_KAFKA_GROUPID,
  }),
};
