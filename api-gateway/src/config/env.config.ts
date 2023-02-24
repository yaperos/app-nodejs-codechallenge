import { env } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

type Environment = {
  port: () => string;
  environment: () => string;
  kafkaHost: () => string;
  kafkaConfig: () => {
    name: string;
    clientId: string;
    groupId: string;
  };
};

export const EnvConfig: Environment = {
  port: () => env.PORT,
  environment: () => env.ENVIRONMENT,
  kafkaHost: () => `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  kafkaConfig: () => ({
    name: env.KAFKA_NAME,
    clientId: env.KAFKA_CLIENTID,
    groupId: env.KAFKA_GROUPID,
  }),
};
