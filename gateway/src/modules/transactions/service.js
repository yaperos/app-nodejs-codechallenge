const { TransactionRequestPublisher } = require('@yape-challenge/kafka');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

const NEW_TRANSACTION = 'new_transaction';

class TransactionServiceBase {
  static async publishTransaction(newTransaction) {
    try {
      const transaction = TransactionServiceBase.generateMessage(newTransaction);
      await TransactionRequestPublisher.publish(transaction);
      return transaction;
    } catch (error) {
      console.error(TransactionServiceBase.name, 'Error publishing transaction:', error);
      throw createError(500, 'Error publishing transaction');
    }
  }

  static async publishMasiveTransaction(newTransactions) {
    try {
      const groupId = uuidv4();

      const publishPromises = newTransactions.map((transaction) => {
        const message = TransactionServiceBase.generateMessage(transaction, groupId);
        return TransactionRequestPublisher.publish(message);
      });

      await Promise.all(publishPromises);

      return groupId;
    } catch (error) {
      console.error(TransactionServiceBase.name, 'Error publishing mass transaction:', error);
      throw createError(500, 'Error publishing mass transactions');
    }
  }

  static generateMessage(newTransaction, groupId = null) {
    const correlationId = groupId || uuidv4();
    return { type: NEW_TRANSACTION, correlationId, ...newTransaction };
  }
}
module.exports.TransactionService = TransactionServiceBase;
