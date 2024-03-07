// controllers/transactionController.js

const Transaction = require('../models/transactionModel');


exports.createTransaction = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { accountexternaliddebit, accountexternalidcredit, transferenciatypeid, valor } = req.body;

    // Verificar la presencia y validez de los campos requeridos
    if (!accountexternaliddebit || !accountexternalidcredit || !transferenciatypeid || !valor) {
      return res.status(400).json({ message: 'Todos los campos son requeridos: accountexternaliddebit, accountexternalidcredit, transferenciatypeid, valor' });
    }

    // Validar el valor de la transacción
    if (valor > 1000) {
      return res.status(400).json({ message: 'El valor de la transacción excede el límite permitido' });
    }

    // Actualizar el estado de la transacción según las reglas
    let estado = valor > 1000 ? 'rechazado' : 'aprobado';

    // Crear la transacción en la base de datos
    const transaction = await Transaction.create({
      accountexternaliddebit,
      accountexternalidcredit,
      transferenciatypeid,
      valor,
      estado
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
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

exports.updateTransactionState = async (req, res) => {
  try {
    const { id } = req.params;
    const { newState } = req.body; // Supongamos que el nuevo estado se envía en el cuerpo de la solicitud

    // Encuentra la transacción por su ID
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Actualiza el estado de la transacción
    transaction.estado = newState;
    await transaction.save();

    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

