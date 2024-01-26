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

async function createMassiveTransactions(req, res, next) {
  try {
    const { body } = req;

    const groupId = await TransactionService.publishMasiveTransaction(body);

    res.status(201).json({
      message: 'Massive transactions created',
      data: {
        correlationId: groupId,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports.TransactionController = {
  createTransaction,
  createMassiveTransactions,
};
