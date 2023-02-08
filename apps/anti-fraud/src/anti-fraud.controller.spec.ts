import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { TransactionStatus } from './enums/status';

describe('AntiFraudController', () => {
  let antiFraudController: AntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [AntiFraudService],
    }).compile();

    antiFraudController = app.get<AntiFraudController>(AntiFraudController);
  });

  describe('root', () => {
    it('should return "approved"', () => {
      expect(antiFraudController.verifyTransaction(999)).toBe(
        TransactionStatus.APPROVED,
      );
    });

    it('should return "approved"', () => {
      expect(antiFraudController.verifyTransaction(1000)).toBe(
        TransactionStatus.APPROVED,
      );
    });

    it('should return "rejected"', () => {
      expect(antiFraudController.verifyTransaction(1001)).toBe(
        TransactionStatus.REJECTED,
      );
    });
  });
});
