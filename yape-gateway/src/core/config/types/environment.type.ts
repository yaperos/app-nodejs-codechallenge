import { KafkaConfig } from './kafkaconfig.type';

export type Environment = {
  kafkaHost: string;
  kafkaConfig: KafkaConfig;
};
