import { KafkaMessage } from "kafkajs";
import ProducerFactory from '../bootstrap/producer.kafka';
import { StatusInterface, TransactionInterface } from '../../src/Interfaces/transaction.interface'
import { AntifraudInterface } from '../../src/Interfaces/antifraud.interface'

const producerFactory = new ProducerFactory();
producerFactory.start();

export const antifraudService = (message: KafkaMessage): void => {
  if (message.value) {
    const data: TransactionInterface = JSON.parse(message.value.toString());
    const transactionResolved: AntifraudInterface = {
      transactionExternalId: data.transactionExternalId,
      status: StatusInterface.REJECTED
    }
    if (data.value < 1000) {
      transactionResolved.status = StatusInterface.APPROVED;
    }
    producerFactory.send(transactionResolved);
  }
};
