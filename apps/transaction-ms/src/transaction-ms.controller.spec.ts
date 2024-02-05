import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMsController } from './transaction-ms.controller';
import { TransactionMsService } from './transaction-ms.service';

describe('TransactionMsController', () => {
  let transactionMsController: TransactionMsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionMsController],
      providers: [TransactionMsService],
    }).compile();

    transactionMsController = app.get<TransactionMsController>(TransactionMsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionMsController.getHello()).toBe('Hello World!');
    });
  });
});
