import { Transaction } from '../models/transaction.model.js';
import { sendTransactionStatusEvent } from '../kafka/producer.js';

export const validateTransaction = async (transaction: Transaction) => {
  if (transaction.value > 1000) {
    transaction.transactionStatus = 'rejected';
  } else {
    transaction.transactionStatus = 'approved';
  }

  await sendTransactionStatusEvent(transaction);
};
