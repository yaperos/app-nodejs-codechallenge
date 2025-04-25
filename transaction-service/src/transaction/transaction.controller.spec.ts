import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('get valid transaction', async () => {
    const transactionId = '1';
    const transaction = {
      transactionExternalId: transactionId,
      accountExternalIdCredit: '123',
      accountExternalIdDebit: '456',
      value: 100,
      transactionType: {
        name: 'CREDIT',
      },
      transactionStatus: {
        name: 'PENDING',
      },
      createdAt: new Date(),
    };
    mockTransactionService.findOne.mockResolvedValue(transaction);
    const result = await controller.findOne(transactionId);
    expect(result).toEqual(transaction);
    expect(mockTransactionService.findOne).toHaveBeenCalledWith(transactionId);
    expect(mockTransactionService.findOne).toHaveBeenCalledTimes(1);
  });

  it('create valid transaction', async () => {
    const createTransactionDto = {
      accountExternalIdCredit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      accountExternalIdDebit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      value: 100,
      transferTypeId: 1,
    };
    const transaction = {
      transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      accountExternalIdCredit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      accountExternalIdDebit: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
      value: 100,
      transactionType: {
        name: 'CREDIT',
      },
      transactionStatus: {
        name: 'PENDING',
      },
      createdAt: new Date(),
    };
    mockTransactionService.create.mockResolvedValue(transaction);
    const result = await controller.create(createTransactionDto);
    expect(result).toEqual(transaction);
    expect(mockTransactionService.create).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(mockTransactionService.create).toHaveBeenCalledTimes(1);
  });
});
