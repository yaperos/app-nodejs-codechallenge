// services/transactionService.js

// Aquí podrías tener funciones para interactuar con el modelo de transacción, 
// realizar validaciones adicionales u operaciones de negocio, etc.

const Transaction = require('../models/transactionModel');

// Función para crear una nueva transacción
exports.createTransaction = async (data) => {
  try {
    // Aquí podrías realizar validaciones adicionales o procesamiento de datos antes de crear la transacción
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new Error('Error al crear la transacción');
  }
};

// Función para obtener una transacción por su ID
exports.getTransactionById = async (id) => {
  try {
    const transaction = await Transaction.findByPk(id);
    return transaction;
  } catch (error) {
    throw new Error('Error al obtener la transacción');
  }
};

// Función para actualizar el estado de una transacción
exports.updateTransactionState = async (id, newState) => {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }
    transaction.estado = newState;
    await transaction.save();
    return transaction;
  } catch (error) {
    throw new Error('Error al actualizar el estado de la transacción');
  }
};
