import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from './transaction.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: DeepMocked<TransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: createMock<TransactionService>(),
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
