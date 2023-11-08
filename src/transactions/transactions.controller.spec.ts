import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { faker } from '@faker-js/faker';
import { Transaction } from 'src/entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransaction = {
    id: 'some-uuid',
    accountExternalIdDebit: 'debit-uuid',
    accountExternalIdCredit: 'credit-uuid',
    transferTypeId: 1,
    value: 100,
    status: 'pending',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockTransactionsService = {
      create: jest.fn((dto) => {
        return {
          id: 'a-uuid',
          ...dto,
          status: 'pending',
          createdAt: new Date(),
        };
      }),

      findAll: jest.fn(() => {
        return [
          {
            id: '123',
            accountExternalIdDebit: 'abc',
            accountExternalIdCredit: 'def',
            transferTypeId: 1,
            value: 500,
            status: 'approved',
            createdAt: new Date('2023-01-01T00:00:00Z'),
          },
          {
            id: '456',
            accountExternalIdDebit: 'ghi',
            accountExternalIdCredit: 'jkl',
            transferTypeId: 2,
            value: 300,
            status: 'pending',
            createdAt: new Date('2023-01-02T00:00:00Z'),
          },
        ];
      }),

      findOne: jest.fn((id: string) => {
        return {
          ...mockTransaction,
          id,
        };
      }),

      updateStatus: jest.fn((id, status) => {
        return {
          id,
          status,
          accountExternalIdDebit: 'some-debit-id',
          accountExternalIdCredit: 'some-credit-id',
          value: 100,
          createdAt: new Date('2023-01-01T00:00:00Z'),
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: faker.finance.accountNumber(),
        accountExternalIdCredit: faker.finance.accountNumber(),
        transferTypeId: Math.random(),
        value: parseFloat(faker.finance.amount()),
      };

      expect(await controller.createTransaction(createTransactionDto)).toEqual({
        id: expect.any(String),
        ...createTransactionDto,
        status: 'pending',
        createdAt: expect.any(Date),
      });
      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
    });
  });

  describe('getAllTransactions', () => {
    it('should get an array of transactions', async () => {
      const result = await controller.getAllTransactions();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalled();
      expect(result[0].id).toEqual('123');
      expect(result[0].status).toEqual('approved');
    });
  });

  describe('getTransaction', () => {
    it('should get a single transaction', async () => {
      const transactionId = 'some-uuid';
      const mockTransaction: Transaction = {
        id: transactionId,
        accountExternalIdDebit: 'debit-uuid',
        accountExternalIdCredit: 'credit-uuid',
        transferTypeId: 1,
        value: 100,
        status: 'pending',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        checkTransactionValue: function (): void {
          throw new Error('Function not implemented.');
        },
      };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockTransaction);

      const result = await controller.getTransaction(transactionId);
      expect(result).toEqual(mockTransaction);
      expect(service.findOne).toHaveBeenCalledWith(transactionId);
    });
  });

  describe('updateTransactionStatus', () => {
    it('should update the status of the transaction', async () => {
      const transactionId = 'some-uuid';
      const status = 'approved';
      const mockTransaction = {
        id: transactionId,
        status,
        accountExternalIdDebit: 'some-debit-id',
        accountExternalIdCredit: 'some-credit-id',
        value: 100,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      };
      service.updateStatus = jest.fn().mockResolvedValue(mockTransaction);

      const result = await controller.updateTransactionStatus({
        id: transactionId,
        status,
      });

      expect(result).toEqual(mockTransaction);
      expect(service.updateStatus).toHaveBeenCalledWith(transactionId, status);
    });
  });
});
