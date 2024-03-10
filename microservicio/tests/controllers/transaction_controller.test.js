const antifraudService = require('../../services/antifraud.service');
const TransactionService = require('../../services/transaction.service');
const KafkaService = require('../../services/kafka.service');
const transactionController = require('../../controllers/transactionController');

jest.mock('../../services/antifraud.service', () => ({
  validateTransaction: jest.fn(),
}));

jest.mock('../../services/transaction.service', () => ({
  createTransaction: jest.fn(),
}));

jest.mock('../../services/kafka.service', () => ({
  sendToTopic: jest.fn(),
}));

describe('Transaction Controller', () => {
  describe('createTransaction', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
    });

    test('should create a transaction and send to Kafka', async () => {
      // Datos de la transacción
      const transactionData = {
        accountexternaliddebit: '123456',
        accountexternalidcredit: '789012',
        transferenciatypeid: 'some_type_id',
        valor: 500,
        estado: 'pendiente',
      };

      // Simula que la validación de la transacción devuelve 'aprobado'
      antifraudService.validateTransaction.mockResolvedValue('aprobado');
      
      // Simula la creación de la transacción
      TransactionService.createTransaction.mockResolvedValue(transactionData);
      
      // Simula el envío a Kafka
      KafkaService.sendToTopic.mockResolvedValue();

      // Solicitud y respuesta falsas
      const req = { body: transactionData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Ejecuta el controlador
      await transactionController.createTransaction(req, res);

      // Verifica si se llaman a las funciones correspondientes
      expect(antifraudService.validateTransaction).toHaveBeenCalledWith({ valor: 500 });
      expect(TransactionService.createTransaction).toHaveBeenCalledWith(transactionData);
      expect(KafkaService.sendToTopic).toHaveBeenCalledWith('nombre_del_tema', JSON.stringify(transactionData));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 500 if an internal server error occurs', async () => {
      // Simula que la validación de la transacción arroja un error
      antifraudService.validateTransaction.mockRejectedValue(new Error('Internal Server Error'));

      // Solicitud y respuesta falsas
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Ejecuta el controlador
      await transactionController.createTransaction(req, res);

    });
  });
});
