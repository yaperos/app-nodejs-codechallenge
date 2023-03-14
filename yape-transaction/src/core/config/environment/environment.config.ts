import { env } from 'process';
import { Environment } from '@core/config/types';
import dotenv from 'dotenv';
dotenv.config();

export const environment: Environment = {
  kafkaHost: `${env.KAFKA_HOST}:${env.KAFKA_PORT}`,
  kafkaGroupId: env.KAFKA_GROUPID,
  databaseConfig: {
    host: env.DATABASE_HOST,
    port: parseInt(env.DATABASE_PORT),
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
  antifraudKafkaConfig: {
    host: `${env.ANTIFRAUD_KAFKA_HOST}:${env.ANTIFRAUD_KAFKA_PORT}`,
    name: env.ANTIFRAUD_KAFKA_NAME,
    clientId: env.ANTIFRAUD_KAFKA_CLIENTID,
    groupId: env.ANTIFRAUD_KAFKA_GROUPID,
  },
  cacheConfig: {
    host: env.REDIS_HOST,
    name: env.REDIS_NAME,
    username: env.REDIS_USERNAME,
    passsword: env.REDIS_PASSWORD,
    port: parseInt(env.REDIS_PORT),
    ttl: parseInt(env.REDIS_TTL),
    max: parseInt(env.REDIS_MAX),
  },
};

export const seedInit: boolean = env.SEED_INIT == 'true';
