const { TransactionService } = require('./service');

async function createTransaction(req, res, next) {
  try {
    const { body } = req;

    const transaction = await TransactionService.publishTransaction(body);

    res.status(201).json({ message: 'Transaction created', data: transaction });
  } catch (error) {
    next(error);
  }
}

async function getTransaction(req, res, next) {
  try {
    const { query } = req;

    const transaction = await TransactionService.getTransaction(query);

    res.status(200).json({ ...transaction });
  } catch (error) {
    next(error);
  }
}

module.exports.TransactionController = {
  createTransaction,
  getTransaction,
};
