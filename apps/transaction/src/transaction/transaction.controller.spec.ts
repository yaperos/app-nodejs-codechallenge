import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn(),
          },
        },
        { provide: 'ANTI-FRAUD-MICROSERVICE', useValue: { send: jest.fn() } },
        {
          provide: 'PROM_METRIC_TRANSACTIONS_SAVED',
          useValue: { inc: jest.fn() },
        },
        {
          provide: 'PROM_METRIC_TRANSACTIONS_UPDATED',
          useValue: { inc: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
