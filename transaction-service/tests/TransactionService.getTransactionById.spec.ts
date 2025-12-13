
// Test para getTransactionById de TransactionService
import { TransactionService } from '../src/services/TransactionService';
import { AppDataSource } from '../src/config/data-source';
import { Transaction } from '../src/entities/Transaction';


// Mock de AppDataSource para aislar la base de datos
jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

describe('TransactionService - getTransactionById', () => {
  let transactionService: TransactionService;
  let mockFindOne: jest.Mock;

  // Configura el mock antes de cada test
  beforeEach(() => {
    transactionService = new TransactionService();
    mockFindOne = jest.fn(); // Mock para findOne del repositorio
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      findOne: mockFindOne
    });
  });

  // Devuelve la transacción si existe
  it('debe devolver la transacción si existe', async () => {
    const fakeTransaction = { transactionExternalId: 'abc-123' } as Transaction;
    mockFindOne.mockResolvedValue(fakeTransaction); // Simula que la transacción existe
    const result = await transactionService.getTransactionById('abc-123');
    expect(result).toBe(fakeTransaction); // Debe devolver la transacción encontrada
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { transactionExternalId: 'abc-123' },
      relations: ['transactionType', 'transactionStatus'],
    });
  });

  // Devuelve null si la transacción no existe
  it('debe devolver null si la transacción no existe', async () => {
    mockFindOne.mockResolvedValue(null); // Simula que no existe
    const result = await transactionService.getTransactionById('no-existe');
    expect(result).toBeNull(); // Debe devolver null
  });
});
