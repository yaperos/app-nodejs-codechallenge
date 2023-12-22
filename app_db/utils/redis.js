const Redis = require('ioredis');
const REDIS_TRANSACTION_PREFIX = 'TR-';

console.log('REDIS_TRANSACTION', process.env.REDIS_HOST || '0.0.0.0');

const redisTransactions = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST || '0.0.0.0'
});

const insertTransaction = (data)=>{
  const transactionId = REDIS_TRANSACTION_PREFIX + data.transactionExternalId;
  redisTransactions.setnx(transactionId, JSON.stringify(data));
};

const updateTransaction = async(data) => {
  const transactionId = REDIS_TRANSACTION_PREFIX + data.transactionExternalId;
  redisTransactions.set(transactionId,
                        JSON.stringify(data));
};


module.exports = { redisTransactions, insertTransaction, updateTransaction};
