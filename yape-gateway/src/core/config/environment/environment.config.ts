import { env } from 'process';
import { Environment } from '@core/config/types';
import dotenv from 'dotenv';
dotenv.config();

export const environment: Environment = {
  kafkaHost: `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  kafkaConfig: {
    name: env.KAFKA_NAME,
    clientId: env.KAFKA_CLIENTID,
    groupId: env.KAFKA_GROUPID,
  },
};
