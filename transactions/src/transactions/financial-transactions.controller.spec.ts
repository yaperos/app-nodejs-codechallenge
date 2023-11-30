import { Test, TestingModule } from '@nestjs/testing';
import { FinancialTransactionsController } from '@/transactions/financial-transactions.controller';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';

describe('FinancialTransactionsController', () => {
  let controller: FinancialTransactionsController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FinancialTransactionsController],
      providers: [FinancialTransactionsService],
    }).compile();

    controller = moduleRef.get<FinancialTransactionsController>(
      FinancialTransactionsController,
    );
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const result = await controller.findAll();

      expect(result.length).toBe(0);
    });
  });

  describe('create', () => {
    it('should add 1 transaction', async () => {
      const transaction: CreateFinancialTransactionDTO = {
        accountExternalIdDebit: 'from',
        accountExternalIdCredit: 'to',
        tranferTypeId: 1,
        value: 120,
      };

      expect(await controller.create(transaction)).toBe(transaction);
    });
  });
});
