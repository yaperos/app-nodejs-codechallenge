const transactionService = require('../../services/transaction.service');
const Transaction = require('../../models/transactionModel');

jest.mock('../../models/transactionModel', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe('transactionService', () => {
  describe('createTransaction', () => {
    test('should create transaction with pending status', async () => {
      const transactionData = { /* datos de la transacción */ };
      const mockTransaction = { id: 1, /* otros datos de la transacción */ };
      Transaction.create.mockResolvedValue(mockTransaction);

      const result = await transactionService.createTransaction(transactionData);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.create).toHaveBeenCalledWith(expect.objectContaining({
        ...transactionData,
        estado: 'pendiente',
      }));
    });

    // Agrega más pruebas según sea necesario para cubrir otros casos de prueba
  });

  describe('getTransactionById', () => {
    // Implementa pruebas para obtener transacción por ID
  });

  describe('updateTransactionState', () => {
    // Implementa pruebas para actualizar estado de transacción
  });
});
