const { createTransaction, getTransactionById } = require('./transaction.service');

async function createTransactionHandler(req, res) {
  try {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value
    } = req.body;

    // Validación mínima
    if (!accountExternalIdDebit || !accountExternalIdCredit || !tranferTypeId || value === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Crear transacción
    const transaction = await createTransaction({
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value
    });

    // Respuesta según contrato
    res.status(201).json({
      transactionExternalId: transaction.id,
      transactionType: { name: "" },       // vacío
      transactionStatus: { name: "" },     // vacío
      value: transaction.value,
      createdAt: transaction.createdAt
    });
  } catch (error) {
    console.error('Error creating transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getTransactionByIdHandler(req, res) {
  try {
    const { id } = req.params;

    const transaction = await getTransactionById(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Respuesta según contrato
    res.json({
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.tranferTypeId === 1 ? 'TRANSFER' : 'UNKNOWN'
      },
      transactionStatus: {
        name: transaction.status
      },
      value: transaction.amount,
      createdAt: transaction.createdAt
    });
  } catch (error) {
    console.error('Error getting transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createTransactionHandler,
  getTransactionByIdHandler
};
