import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { Transaction } from './models/transaction.model';
import { FindTransactionOutput } from './dto/find-transaction.output';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  const mockTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTransaction', () => {
    const createInput: CreateTransactionInput = {
      accountExternalIdDebit: 'acc-001',
      accountExternalIdCredit: 'acc-002',
      transferTypeId: 1,
      value: 100,
    };

    const mockTransaction: Transaction = {
      id: '123',
      ...createInput,
      idempotencyKey: 'key-123',
      status: 'PENDING',
      createdAt: new Date(),
    } as Transaction;

    it('should create a transaction', async () => {
      mockTransactionService.create.mockResolvedValue(mockTransaction);

      const result = await resolver.createTransaction(createInput);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionService.create).toHaveBeenCalledWith(createInput);
      expect(mockTransactionService.create).toHaveBeenCalledTimes(1);
    });

    it('should pass the input to service.create', async () => {
      mockTransactionService.create.mockResolvedValue(mockTransaction);

      await resolver.createTransaction(createInput);

      expect(mockTransactionService.create).toHaveBeenCalledWith(createInput);
    });
  });

  describe('findAll', () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        accountExternalIdDebit: 'acc-001',
        accountExternalIdCredit: 'acc-002',
        transferTypeId: 1,
        value: 100,
        idempotencyKey: 'key-1',
        status: 'APPROVED',
        createdAt: new Date(),
      } as Transaction,
      {
        id: '2',
        accountExternalIdDebit: 'acc-003',
        accountExternalIdCredit: 'acc-004',
        transferTypeId: 2,
        value: 200,
        idempotencyKey: 'key-2',
        status: 'REJECTED',
        createdAt: new Date(),
      } as Transaction,
    ];

    it('should return all transactions', async () => {
      mockTransactionService.findAll.mockResolvedValue(mockTransactions);

      const result = await resolver.findAll();

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no transactions exist', async () => {
      mockTransactionService.findAll.mockResolvedValue([]);

      const result = await resolver.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const mockOutput: FindTransactionOutput = new FindTransactionOutput({
      id: '123',
      accountExternalIdDebit: 'acc-001',
      accountExternalIdCredit: 'acc-002',
      transferTypeId: 1,
      value: 100,
      idempotencyKey: 'key-123',
      status: 'APPROVED',
      createdAt: new Date(),
    } as Transaction);

    it('should return a transaction by id', async () => {
      mockTransactionService.findById.mockResolvedValue(mockOutput);

      const result = await resolver.findOne('123');

      expect(result).toEqual(mockOutput);
      expect(mockTransactionService.findById).toHaveBeenCalledWith('123');
      expect(mockTransactionService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when transaction not found', async () => {
      mockTransactionService.findById.mockResolvedValue(null);

      const result = await resolver.findOne('non-existent');

      expect(result).toBeNull();
      expect(mockTransactionService.findById).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });
});
