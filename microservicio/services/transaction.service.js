// services/transactionService.js

const Transaction = require('../models/transactionModel');

exports.createTransaction = async (data) => {
  try {
    // Agrega el estado inicial como "pendiente" a los datos de la transacción
    data.estado = 'pendiente';

    // Crea la transacción con el estado inicial como "pendiente"
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new Error('Error creating transaction');
  }
};

exports.getTransactionById = async (id) => {
  try {
    const transaction = await Transaction.findByPk(id);
    return transaction;
  } catch (error) {
    throw new Error('Error getting transaction by ID');
  }
};

exports.updateTransactionState = async (id, newState) => {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.estado = newState;
    await transaction.save();
    return transaction;
  } catch (error) {
    throw new Error('Error updating transaction state');
  }
};
