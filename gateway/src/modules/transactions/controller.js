const { TransactionRequestPublisher } = require("@yape-challenge/kafka");
const { v4: uuidv4 } = require("uuid");

async function createTransaction(req, res, next) {
  try {
    const { body } = req;
    const correlationId = uuidv4();
    const transaction = { ...body, correlationId };

    await TransactionRequestPublisher.publish(transaction);

    res.status(201).json({ message: "Transaction created", data: transaction });
  } catch (error) {
    next(error);
  }
}

async function createMassiveTransactions(req, res, next) {
  try {
    const { body } = req;
    const groupId = uuidv4();

    const publishPromises = body.map((transaction) => {
      const message = { ...transaction, correlationId: groupId };
      return TransactionRequestPublisher.publish(message);
    });

    await Promise.all(publishPromises);

    res.status(201).json({
      message: "Massive transactions created",
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
