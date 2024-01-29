const { TransactionRequestPublisher } = require('@yape-challenge/kafka');
const { TransactionsAPI } = require('@yape-challenge/broker-service');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

const NEW_TRANSACTION = 'new_transaction';

class TransactionServiceBase {
  /**
   * Publishes a new transaction to a Kafka topic.
   * 
   * @param {Object} newTransaction - The transaction data to be published.
   * @returns {Promise<Object>} A Promise that resolves to the transaction object that was published.
   * @throws {HttpError} Throws an HTTP 500 error if the publishing fails.
   * @static
   * @async
   */
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

  /**
   * Generates a transaction message with a unique correlation ID.
   * 
   * @param {Object} newTransaction - The new transaction data.
   * @param {string|null} [groupId=null] - An optional group ID to use as the correlation ID. If not provided, a UUID v4 is generated.
   * @returns {Object} The transaction message object, including the type, correlation ID, and transaction data.
   * @static
   */
  static generateMessage(newTransaction, groupId = null) {
    const correlationId = groupId || uuidv4();
    return { type: NEW_TRANSACTION, correlationId, ...newTransaction };
  }

/**
 * Retrieves transactions based on specified query parameters.
 * 
 * @param {Object} query - The query parameters for the transaction retrieval.
 * @param {string[]} query.fields - Fields to be included in the response.
 * @param {Object} query.filterBy - Filter conditions for the transactions.
 * @param {number} query.limit - The maximum number of transactions to retrieve.
 * @param {number} query.page - The page number for pagination.
 * @param {string} query.sortBy - The field to sort the transactions by.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of transaction objects.
 * @throws {HttpError} Throws an HTTP 500 error if the retrieval fails.
 * @static
 * @async
 */
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
