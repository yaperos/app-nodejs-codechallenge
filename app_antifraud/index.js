const {produceMessage, consumeMessage} = require('./utils/kafka.js');
const {KAFKA_TOPIC_INSERT_TRANSACTION, KAFKA_TOPIC_UPDATE_TRANSACTION} = require('./utils/constants.js');
const {transactionStatus}   = require('./utils/constants.js');

console.log(KAFKA_TOPIC_INSERT_TRANSACTION);

consumeMessage(KAFKA_TOPIC_INSERT_TRANSACTION, (data)=> {
  if (typeof(data.value) != 'number'){ //rejected
    data.transactionStatus = transactionStatus[3];
    produceMessage(KAFKA_TOPIC_UPDATE_TRANSACTION, data);
  }
  if (data.value>1000) { //rejected
    data.transactionStatus = transactionStatus[3];
    produceMessage(KAFKA_TOPIC_UPDATE_TRANSACTION, data);
  } else {//aproved
    data.transactionStatus = transactionStatus[2];
    produceMessage(KAFKA_TOPIC_UPDATE_TRANSACTION, data);
  }
}).catch(console.error);

