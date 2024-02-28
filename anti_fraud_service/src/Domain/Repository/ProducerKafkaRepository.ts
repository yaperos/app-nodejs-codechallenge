import { ProducerRecord } from 'kafkajs';

export interface ProducerKafkaInterfaceRepository {
  sendMessage(record: ProducerRecord);
}
