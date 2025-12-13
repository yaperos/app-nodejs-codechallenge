import { TransactionService } from '../src/services/TransactionService';
import { AppDataSource } from '../src/config/data-source';
import { Transaction } from '../src/entities/Transaction';
import { TransactionStatus } from '../src/entities/TransactionStatus';
import { TransactionStatusName } from '../src/enum/TransactionStatusName';
import { TransactionEventService } from '../src/services/TransactionEventService';

jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));
jest.mock('../src/services/TransactionEventService');

// Mock para el producer de Kafka 
jest.mock('../src/kafka/client/producer', () => ({
  producer: { connect: jest.fn(), send: jest.fn(), disconnect: jest.fn() },
  sendTransactionCreatedEvent: jest.fn(),
}));

describe('TransactionService - createTransaction', () => {
  let transactionService: TransactionService;
  let mockTransactionRepo: any;
  let mockStatusRepo: any;
  let mockSave: jest.Mock;
  let mockCreate: jest.Mock;
  let mockFindOne: jest.Mock;

  beforeEach(() => {
    
    transactionService = new TransactionService();
    mockSave = jest.fn();
    mockCreate = jest.fn();
    mockFindOne = jest.fn();
    mockTransactionRepo = { create: mockCreate, save: mockSave };
    mockStatusRepo = { findOne: mockFindOne };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementation((entity) => {
        if (entity === Transaction) return mockTransactionRepo;
        if (entity === TransactionStatus) return mockStatusRepo;
      });
    (TransactionEventService as jest.Mock).mockClear();
  });

  // Debe crear y devolver la transacción correctamente
  it('debe crear y devolver la transacción', async () => {
    const input = {
      accountExternalIdDebit: 'b3e1a2c4-5d6f-7a8b-9c0d-1e2f3a4b5c6d',
      accountExternalIdCredit: 'c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      transferTypeId: 1,
      value: 100
    };
    const pendingStatus = { id: 10, name: TransactionStatusName.Pending };
    const fakeTransaction = { ...input, transactionStatus: { id: 10 }, transactionType: { id: 1 } };
    const savedTransaction = { transactionExternalId: 'tx-123', ...fakeTransaction };
    mockFindOne.mockResolvedValue(pendingStatus);
    mockCreate.mockReturnValue(fakeTransaction);
    mockSave.mockResolvedValue(savedTransaction);
    const result = await transactionService.createTransaction(input);
    expect(result).toBe(savedTransaction);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: TransactionStatusName.Pending } });
    expect(mockCreate).toHaveBeenCalledWith({
      ...input,
      transactionStatus: { id: pendingStatus.id },
      transactionType: { id: input.transferTypeId },
    });
    expect(mockSave).toHaveBeenCalledWith(fakeTransaction);
  });

  // Lanza error si el estado pending no existe
  it('debe lanzar error si no existe el estado pending', async () => {
    mockFindOne.mockResolvedValue(null);
    await expect(
      transactionService.createTransaction({
        accountExternalIdDebit: 'b3e1a2c4-5d6f-7a8b-9c0d-1e2f3a4b5c6d',
        accountExternalIdCredit: 'c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
        transferTypeId: 1,
        value: 100
      })
    ).rejects.toThrow('Estado inicial "pending" no encontrado');
  });
});
