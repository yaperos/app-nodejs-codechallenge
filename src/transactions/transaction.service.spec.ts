import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '@/kafka/kafka.service';
import { CreateTransactionInput } from './dto/create-transaction.input';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockKafkaService = {
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: KafkaService, useValue: mockKafkaService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    const input: CreateTransactionInput = {
      accountExternalIdDebit: 'ACC-001',
      accountExternalIdCredit: 'ACC-002',
      transferTypeId: 1,
      value: 100,
    };

    const createdTransaction = {
      id: 'tx-123',
      idempotencyKey: 'idem-key-123',
      ...input,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create new transaction with generated idempotency key', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);
      mockPrismaService.transaction.create.mockResolvedValue(
        createdTransaction,
      );

      const result = await service.create(input);

      expect(mockPrismaService.transaction.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.transaction.create).toHaveBeenCalled();

      const findUniqueMock = mockPrismaService.transaction
        .findUnique as unknown as jest.Mock;
      const fuCalls = findUniqueMock.mock.calls as Array<
        [{ where: { idempotencyKey: string } }]
      >;
      const fuArgs = fuCalls[0][0];

      expect(typeof fuArgs.where.idempotencyKey).toBe('string');
      expect(fuArgs.where.idempotencyKey.length).toBeGreaterThan(0);

      const createMock = mockPrismaService.transaction
        .create as unknown as jest.Mock;
      const createCalls = createMock.mock.calls as Array<
        [
          {
            data: {
              idempotencyKey: string;
              status: string;
            } & CreateTransactionInput;
          },
        ]
      >;
      const createArgs = createCalls[0][0];
      expect(createArgs.data).toEqual(
        expect.objectContaining({
          ...input,
          status: 'PENDING',
        }),
      );
      expect(typeof createArgs.data.idempotencyKey).toBe('string');
      expect(mockKafkaService.sendMessage).toHaveBeenCalledWith(
        'transaction',
        JSON.stringify(createdTransaction),
      );
      expect(result).toEqual(createdTransaction);
    });

    it('should create new transaction with provided idempotency key', async () => {
      const inputWithKey = { ...input, idempotencyKey: 'custom-key' };
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);
      mockPrismaService.transaction.create.mockResolvedValue(
        createdTransaction,
      );

      await service.create(inputWithKey);

      expect(mockPrismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { idempotencyKey: 'custom-key' },
      });
    });

    it('should return existing transaction if idempotency key exists', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        createdTransaction,
      );

      const result = await service.create(input);

      expect(mockPrismaService.transaction.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.transaction.create).not.toHaveBeenCalled();
      expect(mockKafkaService.sendMessage).not.toHaveBeenCalled();
      expect(result).toEqual(createdTransaction);
    });

    it('should generate deterministic idempotency key for same input', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);
      mockPrismaService.transaction.create.mockResolvedValue(
        createdTransaction,
      );

      await service.create(input);
      const findUniqueMock1 = mockPrismaService.transaction
        .findUnique as unknown as jest.Mock;
      const fuCalls1 = findUniqueMock1.mock.calls as Array<
        [{ where: { idempotencyKey: string } }]
      >;
      const firstArgs = fuCalls1[0][0];
      const firstKey = firstArgs.where.idempotencyKey;

      jest.clearAllMocks();
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);
      mockPrismaService.transaction.create.mockResolvedValue(
        createdTransaction,
      );

      await service.create(input);
      const findUniqueMock2 = mockPrismaService.transaction
        .findUnique as unknown as jest.Mock;
      const fuCalls2 = findUniqueMock2.mock.calls as Array<
        [{ where: { idempotencyKey: string } }]
      >;
      const secondArgs = fuCalls2[0][0];
      const secondKey = secondArgs.where.idempotencyKey;

      expect(firstKey).toBe(secondKey);
    });
  });

  describe('findAll', () => {
    it('should return all transactions ordered by createdAt desc', async () => {
      const transactions = [
        {
          id: 'tx-1',
          createdAt: new Date('2025-01-02'),
          status: 'APPROVED',
        },
        {
          id: 'tx-2',
          createdAt: new Date('2025-01-01'),
          status: 'PENDING',
        },
      ];
      mockPrismaService.transaction.findMany.mockResolvedValue(
        transactions as any,
      );

      const result = await service.findAll();

      expect(mockPrismaService.transaction.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(transactions);
    });

    it('should return empty array when no transactions exist', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    const mockTransaction = {
      id: 'tx-123',
      accountExternalIdDebit: 'ACC-001',
      accountExternalIdCredit: 'ACC-002',
      transferTypeId: 1,
      value: 100,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return transaction output when found', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(
        mockTransaction as any,
      );

      const result = await service.findById('tx-123');

      expect(mockPrismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: 'tx-123' },
      });
      expect(result).toBeDefined();
      expect(result?.transactionExternalId).toBe('tx-123');
    });

    it('should return null when transaction not found', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateInput = {
      id: 'tx-123',
      status: 'APPROVED',
    };

    const updatedTransaction = {
      id: 'tx-123',
      status: 'APPROVED',
      accountExternalIdDebit: 'ACC-001',
      accountExternalIdCredit: 'ACC-002',
      transferTypeId: 1,
      value: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update transaction status', async () => {
      mockPrismaService.transaction.update.mockResolvedValue(
        updatedTransaction as any,
      );

      const result = await service.update(updateInput);

      expect(mockPrismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-123' },
        data: { status: 'APPROVED' },
      });
      expect(result).toEqual(updatedTransaction);
    });
  });
});
