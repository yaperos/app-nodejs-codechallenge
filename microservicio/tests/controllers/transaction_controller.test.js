const Joi = require('joi');
const {
  createTransaction,
  getTransaction,
  updateTransactionState
} = require('../../controllers/transactionController'); // Supongamos que el archivo se encuentra en el mismo directorio
const transactionService = require('../../services/transaction.service');

// Define tu mockTransaction aquí
const mockTransaction = {
  id: 'some-id',
  // Otros campos de transacción...
};


// Mocking services
jest.mock('../../services/kafka.service');
jest.mock('../../services/transaction.service');
jest.mock('../../services/antifraud.service');


describe('Transaction Controller Tests', () => {
  describe('createTransaction', () => {
    it('should return 201 status and created transaction', async () => {
      const mockRequest = {
        body: {
          accountexternaliddebit: 'some-id',
          accountexternalidcredit: 'another-id',
          transferenciatypeid: 1,
          valor: 500
        }
      };
      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn()
      };

      await createTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 400 status if validation fails', async () => {
      const mockRequest = {
        body: {
          // Incomplete data to trigger validation failure
          accountexternaliddebit: 'some-id',
          transferenciatypeid: 1
        }
      };
      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn()
      };

      await createTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('getTransaction', () => {
    it('should return 200 status and transaction if found', async () => {

      // Simular que se encuentra una transacción
  jest.spyOn(transactionService, 'getTransactionById').mockResolvedValueOnce(mockTransaction);

      const mockRequest = {
        params: {
          id: 'some-id'
        }
      };
      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn()
      };

      await getTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 status if transaction not found', async () => {
      const mockRequest = {
        params: {
          id: 'non-existing-id'
        }
      };
      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn()
      };

      await getTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('updateTransactionState', () => {
    it('should return 200 status and updated transaction', async () => {
      const mockRequest = {
        params: {
          id: 'some-id'
        },
        body: {
          newState: 'completed'
        }
      };
      const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn()
      };

      await updateTransactionState(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
