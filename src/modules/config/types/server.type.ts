import { KafkaConfigType } from './kafka.type';

export type ServerConfigType = {
  applicationName: string;
  port: number;
  kafka: KafkaConfigType;
};
