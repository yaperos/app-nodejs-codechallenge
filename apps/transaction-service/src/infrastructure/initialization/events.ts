import { kafkaProducer } from '../di';

export const initKafka = () => {
  kafkaProducer.connect();
};
