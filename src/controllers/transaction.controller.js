const Transaction = require("../models/transaction.model");
const generateTransactionId = require("../helpers/generateTransactionId.helper");
const sendKafkaEvent = require("../helpers/kafkaProducer.helper");

const createTransaction = async (req, res) => {
  const {
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value,
  } = req.body;

  let status = "pending";

  if (value > 1000) {
    status = "rejected";
  }

  try {
    const newTransaction = await Transaction.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      transactionExternalId: generateTransactionId(),
      transactionType: { name: "" },
      transactionStatus: status,
    });

    sendKafkaEvent(newTransaction.transactionExternalId, status);

    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { transactionExternalId: req.params.id },
    });

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactionFindAll = async (req, res) => {
  try {
    const transaction = await Transaction.findAll();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionFindAll,
};
