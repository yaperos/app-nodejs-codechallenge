// controllers/transactionController.js

const Transaction = require('../models/transactionModel');

exports.createTransaction = async (req, res) => {
  try {
    const { accountExternalIdDebit, accountExternalIdCredit, transferenciaTypeId, valor } = req.body;

    // Aquí validas la transacción y actualizas el estado según las reglas

    const transaction = await Transaction.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferenciaTypeId,
      valor
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
