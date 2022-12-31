import { KafkaMessage } from "kafkajs";
import { StatusInterface, TransactionInterface } from '../Interfaces/transaction.interface'
import { AntifraudInterface } from '../Interfaces/antifraud.interface'
import { Transaction } from "../models";

export const antifraudResolveService = async (message: AntifraudInterface): Promise<void> => {

  if (message) {
    const transaction = await Transaction.query().where({transactionExternalId: message.transactionExternalId}).first();
    if (transaction && message.status == StatusInterface.REJECTED) {
      await Transaction.query().findById(transaction.id).patch({status: StatusInterface.REJECTED});
    }
    if (transaction &&  message.status == StatusInterface.APPROVED) {
      await Transaction.query().findById(transaction.id).patch({status: StatusInterface.APPROVED});
    }
  }

};
