
// Test para updateTransactionStatus de TransactionService
import { TransactionService } from '../src/services/TransactionService';
import { AppDataSource } from '../src/config/data-source';
import { Transaction } from '../src/entities/Transaction';
import { TransactionStatus } from '../src/entities/TransactionStatus';
import { TransactionStatusName } from '../src/enum/TransactionStatusName';


// Mock de AppDataSource para aislar la base de datos
jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('TransactionService - updateTransactionStatus', () => {
  let transactionService: TransactionService;
  let mockTransactionRepo: any;
  let mockStatusRepo: any;
  let mockFindOneTransaction: jest.Mock;
  let mockFindOneStatus: jest.Mock;
  let mockSave: jest.Mock;

  // Configura los repositorios y mocks antes de cada test
  beforeEach(() => {
    transactionService = new TransactionService();
    mockFindOneTransaction = jest.fn();
    mockFindOneStatus = jest.fn();
    mockSave = jest.fn();
    mockTransactionRepo = { findOne: mockFindOneTransaction, save: mockSave };
    mockStatusRepo = { findOne: mockFindOneStatus };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementation((entity) => {
        if (entity === Transaction) return mockTransactionRepo;
        if (entity === TransactionStatus) return mockStatusRepo;
      });
  });

  // Debe actualizar el estado de la transacción si existe
  it('debe actualizar el estado de la transacción', async () => {
    const fakeTransaction = { transactionExternalId: 'tx-1' } as Transaction;
    const newStatus = { id: 2, name: TransactionStatusName.Approved };
    mockFindOneTransaction.mockResolvedValue(fakeTransaction);
    mockFindOneStatus.mockResolvedValue(newStatus);
    mockSave.mockResolvedValue({ ...fakeTransaction, transactionStatus: newStatus });
    const result = await transactionService.updateTransactionStatus('tx-1', TransactionStatusName.Approved);
    expect(result).toEqual({ ...fakeTransaction, transactionStatus: newStatus });
    expect(mockFindOneTransaction).toHaveBeenCalledWith({ where: { transactionExternalId: 'tx-1' } });
    expect(mockFindOneStatus).toHaveBeenCalledWith({ where: { name: TransactionStatusName.Approved } });
    expect(mockSave).toHaveBeenCalledWith({ ...fakeTransaction, transactionStatus: newStatus });
  });

  // Devuelve null si la transacción no existe
  it('debe devolver null si la transacción no existe', async () => {
    mockFindOneTransaction.mockResolvedValue(null);
    const result = await transactionService.updateTransactionStatus('no-tx', TransactionStatusName.Approved);
    expect(result).toBeNull();
  });

  // Devuelve null si el nuevo estado no existe
  it('debe devolver null si el nuevo estado no existe', async () => {
    const fakeTransaction = { transactionExternalId: 'tx-2' } as Transaction;
    mockFindOneTransaction.mockResolvedValue(fakeTransaction);
    mockFindOneStatus.mockResolvedValue(null);
    const result = await transactionService.updateTransactionStatus('tx-2', TransactionStatusName.Rejected);
    expect(result).toBeNull();
  });
});
