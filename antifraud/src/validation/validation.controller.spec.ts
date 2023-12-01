import { Test, TestingModule } from '@nestjs/testing';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { FinancialTransaction } from '@transactions/transactions/entities/financial-transaction.entity';

describe('ValidationController', () => {
  let controller: ValidationController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ValidationController],
      providers: [ValidationService],
    }).compile();

    controller = moduleRef.get<ValidationController>(ValidationController);
  });

  describe('validate.rejected', () => {
    it('should return a valid or rejected tx depending of the ammount', async () => {
      let transaction = {
        value: 1001,
      } as FinancialTransaction;

      transaction = await controller.validate(transaction);
      expect(transaction.transactionStatus).toBe('rejected');
    });
  });
  describe('validate.approved', () => {
    it('should return a valid or rejected tx depending of the ammount', async () => {
      let transaction = {
        value: 1000,
      } as FinancialTransaction;

      transaction = await controller.validate(transaction);
      expect(transaction.transactionStatus).toBe('approved');
    });
  });
});
