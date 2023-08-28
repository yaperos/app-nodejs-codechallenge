const { getTransactionInfoDB } = require('../repositories/transactionRespository');

const obtainTransactionInfo = async (transactionId) => {
  const transactionInfo = await getTransactionInfoDB(transactionId);

  return transactionInfo ? {
    transactionExternalId: transactionInfo?.id,
    transactionType: {
      name: transactionInfo?.transferType.name,
    },
    transactionStatus: {
      name: transactionInfo?.status,
    },
    value: transactionInfo?.value,
    createdAt: transactionInfo?.createdAt,
  } : null;
};

module.exports = {
  obtainTransactionInfo,
};
