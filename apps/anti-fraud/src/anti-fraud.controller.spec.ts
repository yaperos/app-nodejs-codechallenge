import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

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
      expect(antiFraudController.verifyTransaction(999)).toBe('approved');
    });
    it('should return "approved"', () => {
      expect(antiFraudController.verifyTransaction(1000)).toBe('approved');
    });
    it('should return "rejected"', () => {
      expect(antiFraudController.verifyTransaction(1001)).toBe('rejected');
    });
  });
});
