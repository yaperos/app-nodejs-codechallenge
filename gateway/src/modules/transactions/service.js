const { TransactionRequestPublisher } = require('@yape-challenge/kafka');
const { TransactionsAPI } = require('@yape-challenge/broker-service');
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

  static generateMessage(newTransaction, groupId = null) {
    const correlationId = groupId || uuidv4();
    return { type: NEW_TRANSACTION, correlationId, ...newTransaction };
  }

  static async getTransaction(query) {
    try {
      const {
        fields, filterBy, limit, page, sortBy,
      } = query;

      const transaction = await TransactionsAPI.getTransactions({
        fields,
        filterBy,
        limit,
        page,
        sortBy,
      });
      return transaction;
    } catch (error) {
      console.error(TransactionServiceBase.name, 'Error getting transaction:', error);
      throw createError(500, 'Error getting transaction');
    }
  }
}
module.exports.TransactionService = TransactionServiceBase;
