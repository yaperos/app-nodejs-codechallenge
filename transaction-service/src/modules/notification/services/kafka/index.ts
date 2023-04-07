import { KafkaService } from 'common-microservice-lib';

const setting = {
  brokers: ['kafka:9092'],
  clientId: 'client-id-1',
  groupId: 'group-id-1',
};

const kafkaService = new KafkaService(setting);

export { kafkaService };
