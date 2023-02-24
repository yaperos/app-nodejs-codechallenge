import { env } from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

type Environment = {
  environment: () => string;
  kafkaHost: () => string;
  dbConfig: () => {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  kafkaGroupId: () => string;
  antifraudKafkaConfig: () => {
    host: string;
    name: string;
    clientId: string;
    groupId: string;
  };
};

export const EnvConfig: Environment = {
  environment: () => env.ENVIRONMENT,
  kafkaHost: () => `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  dbConfig: () => ({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  }),
  kafkaGroupId: () => env.KAFKA_GROUPID,
  antifraudKafkaConfig: () => ({
    host: `${env.ANTIFRAUD_KAFKA_HOST}:${env.ANTIFRAUD_KAFKA_PORT}`,
    name: env.ANTIFRAUD_KAFKA_NAME,
    clientId: env.ANTIFRAUD_KAFKA_CLIENTID,
    groupId: env.ANTIFRAUD_KAFKA_GROUPID,
  }),
};
