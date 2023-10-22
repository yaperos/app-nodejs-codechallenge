import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatusEntity } from '../entity/transaction-status.entity';
import { TransactionTypeEntity } from '../entity/transaction-type.entity';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionService } from '../service/transaction.service';
import { ConsumerController } from './consumer.controller';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let transactionService: TransactionService;

  const customerRepositoryMock: MockType<Repository<TransactionEntity>> = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: customerRepositoryMock,
        },
        {
          provide: getRepositoryToken(TransactionStatusEntity),
          useValue: customerRepositoryMock,
        },
        {
          provide: getRepositoryToken(TransactionTypeEntity),
          useValue: customerRepositoryMock,
        },
      ]
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    transactionService = module.get<TransactionService>(TransactionService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle transaction updated event', async () => {
    const mockData = { message: { transactionExternalId: '123', transactionStatusId: '456' } };

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(transactionService, 'updated').mockImplementation();

    await controller.handlerTransactionUpdated(mockData);

    expect(transactionService.updated).toHaveBeenCalledWith('123', '456');

    jest.restoreAllMocks();
  });
});
