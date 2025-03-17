import { ProducerRecord } from 'kafkajs';

export interface IProducer {
  produce(record: ProducerRecord): Promise<void>;
}
