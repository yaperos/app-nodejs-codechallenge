import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

describe('TransactionController', () => {
  let transactionController: AntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [AntiFraudService],
    }).compile();

    transactionController = app.get<AntiFraudController>(AntiFraudController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionController.getHello()).toBe('Hello World!');
    });
  });
});
