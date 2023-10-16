import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './ms-transactions.controller';
import { TransactionService } from './ms-transactions.service';

describe('MsTransactionsController', () => {
  let msTransactionsController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    msTransactionsController = app.get<TransactionController>(TransactionController);
  });
});
