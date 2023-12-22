const {createTransactionDTO} = require('./utils/transactionDTO');
const {produceMessage, consumeMessage} = require('./utils/kafka.js');
const {transactionStatus} = require('./utils/constants.js');
const {KAFKA_TOPIC_INSERT_TRANSACTION, KAFKA_TOPIC_UPDATE_TRANSACTION} = require('./utils/constants.js');
const {redisHost, insertTransaction, updateTransaction} = require('./utils/redis.js');

consumeMessage([KAFKA_TOPIC_INSERT_TRANSACTION, KAFKA_TOPIC_UPDATE_TRANSACTION], (data)=> {
  if (data.transactionStatus.name === transactionStatus[1])
    insertTransaction(data);
  else
    updateTransaction(data);
}).catch(console.error);

// consumeMessage(KAFKA_TOPIC_INSERT_TRANSACTION, (data)=> {
//     insertTransaction(data);
// }).catch(console.error);

// consumeMessage(KAFKA_TOPIC_UPDATE_TRANSACTION, (data)=> {
//     updateTransaction(data);
// }).catch(console.error);
