const antifraudService = require('../../services/antifraud.service');

describe('antifraudService', () => {
  describe('validateTransaction', () => {
    test('should approve transaction with value <= 1000', async () => {
      const transactionData = { valor: 800 };
      const result = await antifraudService.validateTransaction(transactionData);
      expect(result).toBe('aprobado');
    });

    test('should reject transaction with value > 1000', async () => {
      const transactionData = { valor: 1200 };
      const result = await antifraudService.validateTransaction(transactionData);
      expect(result).toBe('rechazado');
    });

    // Agrega más pruebas según sea necesario para cubrir otros casos de prueba
  });
});
