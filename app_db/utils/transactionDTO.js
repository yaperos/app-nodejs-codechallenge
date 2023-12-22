const {tranferType, transactionStatus} = require('./constants');

const createTransactionDTO = function (externalId, tranferTypeId, transactionStatusId, value, createdAt){
  return {
    transactionExternalId: externalId,
    transactionType: {
      name: tranferType[tranferTypeId]
    },
    transactionStatus: {
      name: transactionStatus[transactionStatusId]
    },
    value: value,
    createdAt: Date.now()
  };
};

module.exports =  {createTransactionDTO};
