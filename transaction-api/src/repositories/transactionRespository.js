const Transaction = require('../models/Transaction');
const TransferType = require('../models/TransferType');

const saveNewTransactionDB = async (transactionData) => Transaction.create(transactionData);

const getTransactionInfoDB = async (transactionId) => Transaction.findByPk(transactionId, {
  include: [
    {
      model: TransferType,
      attributes: ['name'],
      as: 'transferType',
    },
  ],
});

const updateTransactionStatusDB = async (id, newStatus) => Transaction.update(
  { status: newStatus },
  { where: { id } },
);

module.exports = {
  saveNewTransactionDB,
  getTransactionInfoDB,
  updateTransactionStatusDB,
};
