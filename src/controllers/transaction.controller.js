const Transaction = require("../models/transaction.model");
const generateTransactionId = require("../helpers/generateTransactionId.helper");
const sendKafkaEvent = require("../helpers/kafkaProducer.helper");
const {
  STATUS_TRANSACTION,
} = require("../models/enums/statusTransaction.enum");
const { MESSAGE_TRANSACTION_NOT_FOUND } = require("../utils/constants.util");

const createTransaction = async (req, res) => {
  const {
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value,
  } = req.body;

  try {
    const newTransaction = await Transaction.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      transactionExternalId: generateTransactionId(),
      transactionType: { name: "" },
      transactionStatus: { name: STATUS_TRANSACTION.PENDING },
    });

    sendKafkaEvent(
      newTransaction.transactionExternalId,
      STATUS_TRANSACTION.PENDING,
      value
    );

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
      res.status(404).json({ message: MESSAGE_TRANSACTION_NOT_FOUND });
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

const updateTransaction = async (transactionExternalId, newStatus) => {
  try {
    const transaction = await Transaction.findOne({
      where: { transactionExternalId },
    });

    if (!transaction) {
      console.log(`Transaction with ID ${transactionExternalId} not found`);
      return;
    }

    transaction.transactionStatus = { name: newStatus };
    await transaction.save();

    console.log(
      `Transaction with ID ${transactionExternalId} updated to new status: ${newStatus}`
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionFindAll,
  updateTransaction,
};
