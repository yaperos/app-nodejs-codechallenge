const transactionStatus = [null, 'pending', 'approved', 'rejected'];
const tranferType = ["Type 1", "Type 2", "Type 3"];

const KAFKA_TOPIC_INSERT_TRANSACTION = 'ins-trans';
const KAFKA_TOPIC_UPDATE_TRANSACTION = 'upd-trans';

module.exports = {transactionStatus, tranferType, KAFKA_TOPIC_UPDATE_TRANSACTION, KAFKA_TOPIC_INSERT_TRANSACTION};
