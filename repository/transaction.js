const { Transaction } = require('../model/transaction');
const { TranferType } = require('../model/tranfer_type');
const { TransactionStatus } = require('../model/transaction_status');

const createTransaction = async (transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, transactionStatusId, value, createdAt) => {

  console.log(`createTransaction >>> ${{transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, transactionStatusId, value, createdAt}}`);

  return await Transaction.create({transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value, transactionStatusId, createdAt});
}

const updateTransactionStatus = async (transactionExternalId, transactionStatusId) => {

  const transaction = await Transaction.findOne({
    where: {transactionExternalId}
  });

  transaction.transactionStatusId = transactionStatusId;
  return await transaction.save();
}

const getTransactionByTransactionExternalId = async (transactionExternalId) => {

  console.log(`transactionExternalId >>> ${transactionExternalId}`);

  return await Transaction.findOne({where: {transactionExternalId},
                                    include: [
                                      { model: TranferType },
                                      { model: TransactionStatus }
                                    ]
                                    });
}

module.exports = {
  createTransaction,
  updateTransactionStatus,
  getTransactionByTransactionExternalId
}