import { AntiFraudConfig } from './antifraud.type';
import { CacheConfig } from './cache.type';
import { DatabaseConfig } from './database.type';

export type Environment = {
  kafkaHost: string;
  databaseConfig: DatabaseConfig;
  kafkaGroupId: string;
  antifraudKafkaConfig: AntiFraudConfig;
  cacheConfig: CacheConfig;
};
