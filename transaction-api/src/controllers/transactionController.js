const { produceEventNewTransaction } = require('../kafka/transactionProducer');
const { saveNewTransactionDB } = require('../repositories/transactionRespository');
const { obtainTransactionInfo } = require('../services/transactionService');

const createNewTransactionController = async (req, res) => {
  const { body: transactionData } = req;

  try {
    const newTransaction = await saveNewTransactionDB(transactionData);
    await produceEventNewTransaction(newTransaction.id, newTransaction.value);

    return res.status(201).json(newTransaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const obtainTransactionInfoController = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transactionInfo = await obtainTransactionInfo(transactionId);
    return res.status(200).json(transactionInfo);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNewTransactionController,
  obtainTransactionInfoController,
};
