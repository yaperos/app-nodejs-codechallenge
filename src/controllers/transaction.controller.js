const Transaction = require("../models/transaction.model");
const generateTransactionId = require("../helpers/generateTransactionId.helper");
const sendKafkaEvent = require("../helpers/kafkaProducer.helper");
const redisClient = require("../database/redis");
const {
  STATUS_TRANSACTION,
  TYPE_TRANSACTION,
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
      transactionType: { name: TYPE_TRANSACTION[tranferTypeId] },
      transactionStatus: { name: STATUS_TRANSACTION.PENDING },
    });

    await redisClient.del("ALL_TRANSACTIONS");
    await setRedisData(newTransaction.transactionExternalId, newTransaction);

    sendKafkaEvent(
      newTransaction.transactionExternalId,
      STATUS_TRANSACTION.PENDING,
      value
    );

    return res.status(201).json(newTransaction);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const cachedTransaction = await redisClient.get(
      `transaction:${req.params.id}`
    );

    if (cachedTransaction) {
      return res.json(JSON.parse(cachedTransaction));
    } else {
      const transaction = await Transaction.findOne({
        where: { transactionExternalId: req.params.id },
      });

      if (transaction) {
        await setRedisData(transaction.transactionExternalId, transaction);
        return res.json(transaction);
      } else {
        return res.status(404).json({ message: MESSAGE_TRANSACTION_NOT_FOUND });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getTransactionFindAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();

    await redisClient.set("ALL_TRANSACTIONS", JSON.stringify(transactions));

    return res.json(transactions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateTransaction = async (
  transactionExternalId,
  newStatus,
  transactionType
) => {
  try {
    const transaction = await Transaction.findOne({
      where: { transactionExternalId },
    });

    if (!transaction) {
      console.log(`Transaction with ID ${transactionExternalId} not found`);
      return;
    }

    transaction.transactionStatus = { name: newStatus };
    transaction.transactionType = transactionType;
    await transaction.save();

    await redisClient.del("ALL_TRANSACTIONS");
    await setRedisData(transaction.transactionExternalId, transaction);

    console.log(
      `Transaction with ID ${transactionExternalId} updated to new status: ${newStatus}`
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const setRedisData = async (transactionExternalId, transaction) => {
  await redisClient.set(
    `transaction:${transactionExternalId}`,
    JSON.stringify(transaction)
  );
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionFindAll,
  updateTransaction,
};
