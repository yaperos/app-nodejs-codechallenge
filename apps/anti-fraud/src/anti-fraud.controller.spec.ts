import { TransactionStatus } from '@app/database/enums/transaction-status';
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
      const event = {
        accountExternalIdDebit: '123',
        accountExternalIdCredit: '456',
        value: 999,
      };
      expect(antiFraudController.verifyTransactionValue(event)).toBe(
        TransactionStatus.APPROVED,
      );
    });

    it('should return "approved"', () => {
      const event = {
        accountExternalIdDebit: '123',
        accountExternalIdCredit: '456',
        value: 1000,
      };
      expect(antiFraudController.verifyTransactionValue(event)).toBe(
        TransactionStatus.APPROVED,
      );
    });

    it('should return "rejected"', () => {
      const event = {
        accountExternalIdDebit: '123',
        accountExternalIdCredit: '456',
        value: 1001,
      };
      expect(antiFraudController.verifyTransactionValue(event)).toBe(
        TransactionStatus.REJECTED,
      );
    });
  });
});
