import { Test, TestingModule } from '@nestjs/testing';
import { YapeTransactionController } from './yape-transaction.controller';
import { YapeTransactionService } from './yape-transaction.service';

describe('YapeTransactionController', () => {
  let yapeTransactionController: YapeTransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [YapeTransactionController],
      providers: [YapeTransactionService],
    }).compile();

    yapeTransactionController = app.get<YapeTransactionController>(YapeTransactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(yapeTransactionController.getHello()).toBe('Hello World!');
    });
  });
});
