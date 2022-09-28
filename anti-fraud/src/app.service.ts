import { KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_GROUP_ID } from './infrastructure/constants';

export class KafkaConfig {
  readonly groupId: string;
  readonly clientId: string;
  readonly brokers: Array<string>;
}

export class AppService {
  static KafkaConfig(): KafkaConfig {
    return {
      groupId: KAFKA_GROUP_ID,
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKERS],
    };
  }
}
