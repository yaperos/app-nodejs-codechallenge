import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../../domain/services/transaction.service';

describe('TransactionMsController', () => {
  let transactionController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    transactionController = app.get<TransactionController>(TransactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionController.getHello()).toBe('Hello World!');
    });
  });
});
