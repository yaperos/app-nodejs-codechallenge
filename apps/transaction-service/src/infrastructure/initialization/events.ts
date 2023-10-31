import { kafkaProducer } from '../di';

export const initKafka = async () => {
  kafkaProducer.connect();
};
