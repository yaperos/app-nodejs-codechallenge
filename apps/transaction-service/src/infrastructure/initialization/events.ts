import { kafkaProducer } from '../di';

export const initKafka = () => {
  kafkaProducer.connect();

  setInterval(() => {
    kafkaProducer.poll();
  }, 5000);
};
