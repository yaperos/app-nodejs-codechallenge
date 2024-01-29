const { TransactionRequestRetryPublisher } = require('@yape-challenge/kafka');
const Queue = require('bull');

const { ConfigEnv } = require('../../config');

class RetryService {
  static retryQueue = new Queue(ConfigEnv.redis.queue, {
    redis: {
      host: ConfigEnv.redis.host,
      port: ConfigEnv.redis.port,
    },
  });

  static async init() {
    this.consumeRetries();
  }

  /**
   * Schedules a retry for a transaction with a specified delay based on the attempt count.
   * 
   * @param {string} transactionId - The ID of the transaction to retry.
   * @param {number} attempt - The attempt count, which determines the delay before the retry.
   * @returns {Promise<void>}
   * @static
   * @async
   */
  static async scheduleRetry(transactionId, attempt) {
    const delay = this.calculateDelay(attempt);
    await this.retryQueue.add({ transactionId }, { delay });
  }

  /**
   * Calculates the delay before a retry attempt based on the attempt number.
   * 
   * @param {number} attempt - The retry attempt count.
   * @returns {number} The delay in milliseconds before the retry should be attempted.
   * @static
   */
  static calculateDelay(attempt) {
    const delays = {
      1: 1 * 60 * 1000, // 2 minuto
      2: 2 * 60 * 1000, // 2 minutos
      3: 3 * 60 * 1000, // 3 minutos
    };

    return delays[attempt];
  }

  /**
   * Consumes retry jobs from the queue and triggers a retry of the transaction.
   * @static
   */
  static consumeRetries() {
    this.retryQueue.process(async (job) => {
      const { transactionId } = job.data;
      console.log(`Processing retry for transaction ${transactionId}`);

      await TransactionRequestRetryPublisher.publish({
        transactionId,
        type: 'transaction_retry'
      });
    });
  }
}

module.exports = {
  RetryService,
};