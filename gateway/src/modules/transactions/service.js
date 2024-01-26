const { TransactionRequestPublisher } = require('@yape-challenge/kafka');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

class TransactionServiceBase {
  static async publishTransaction(newTransaction) {
    const correlationId = uuidv4();

    try {
      const transaction = { ...newTransaction, correlationId };

      await TransactionRequestPublisher.publish(transaction);

      return transaction;
    } catch (error) {
      console.error(TransactionServiceBase.name, error);
      throw createError(500);
    }
  }

  static async publishMasiveTransaction(newTransactions) {
    try {
      const groupId = uuidv4();

      const publishPromises = newTransactions.map((transaction) => {
        const message = { ...transaction, correlationId: groupId };
        return TransactionRequestPublisher.publish(message);
      });

      await Promise.all(publishPromises);

      return groupId;
    } catch (error) {
      console.error(TransactionServiceBase.name, error);
      throw createError(500);
    }
  }
}
module.exports.TransactionService = TransactionServiceBase;
