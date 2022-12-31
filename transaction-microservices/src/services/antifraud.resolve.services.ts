import { KafkaMessage } from "kafkajs";
import { StatusInterface, TransactionInterface } from '../Interfaces/transaction.interface'
import { AntifraudInterface } from '../Interfaces/antifraud.interface'
import { Transaction } from "../models";

export const antifraudResolveService = async (message: KafkaMessage): Promise<void> => {
  if (message.value) {
    const data: AntifraudInterface = JSON.parse(message.value.toString());
    const transaction = await Transaction.query().where({transactionExternalId: data.transactionExternalId}).first();

    if (transaction && data.status == StatusInterface.REJECTED) {
      await Transaction.query().findById(transaction.id).patch({status: StatusInterface.REJECTED});
    }
    if (transaction &&  data.status == StatusInterface.APPROVED) {
      await Transaction.query().findById(transaction.id).patch({status: StatusInterface.APPROVED});
    }
  }
};
