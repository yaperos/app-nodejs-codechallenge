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

  static async scheduleRetry(transactionId, attempt) {
    const delay = this.calculateDelay(attempt);
    await this.retryQueue.add({ transactionId }, { delay });
  }

  static calculateDelay(attempt) {
    const delays = {
      1: 1 * 60 * 1000, // 2 minuto
      2: 2 * 60 * 1000, // 2 minutos
      3: 3 * 60 * 1000, // 3 minutos
    };

    return delays[attempt];
  }

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