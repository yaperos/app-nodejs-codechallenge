const Transaction = require('../models/transactionModel');

// Crea una nueva transacción con estado "pendiente"
exports.createTransaction = async (data) => {
  try {
    data.estado = 'pendiente'; // Establece el estado inicial como "pendiente"
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new Error('Error creating transaction');
  }
};

// Obtiene una transacción por su ID
exports.getTransactionById = async (id) => {
  try {
    const transaction = await Transaction.findByPk(id);
    return transaction;
  } catch (error) {
    throw new Error('Error getting transaction by ID');
  }
};

// Actualiza el estado de una transacción
exports.updateTransactionState = async (id, newState) => {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.estado = newState; // Actualiza el estado de la transacción
    await transaction.save();
    return transaction;
  } catch (error) {
    throw new Error('Error updating transaction state');
  }
};
