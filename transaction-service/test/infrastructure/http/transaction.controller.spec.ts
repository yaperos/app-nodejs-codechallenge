import { TransactionController } from '../../../src/infrastructure/http/transaction.controller';
import { TransactionService } from '../../../src/application/transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionRequest } from '../../../src/application/dto/create-transaction.request';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            createTransaction: jest.fn().mockResolvedValueOnce({
              transactionExternalId: '1',
              value: 500,
              transactionStatus: { name: 'approved' },
              transactionType: { name: '0' },
              createdAt: new Date(),
            }),
          },
        },
      ],
    }).compile();
    transactionService = module.get<TransactionService>(TransactionService);
    transactionController = module.get<TransactionController>(
      TransactionController,
    );
  });

  describe('postTransaction', () => {
    it('should return a transaction event', async () => {
      const result = {
        accountExternalIdCredit: '1',
        accountExternalIdDebit: '2',
        value: 500,
        transactionStatus: { name: 'approved' },
      };
      const postTransactionRequest: CreateTransactionRequest = {
        accountExternalIdCredit: '1',
        accountExternalIdDebit: '2',
        value: 500,
        tranferTypeId: 1,
      };
      transactionService.createTransaction = jest
        .fn()
        .mockResolvedValue(result);
      expect(
        await transactionController.postTransaction(postTransactionRequest),
      ).toBe(result);
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction event', async () => {
      const result = {
        accountExternalIdCredit: '1',
        accountExternalIdDebit: '2',
        value: 500,
        transactionStatus: { name: 'approved' },
      };
      transactionService.getTransaction = jest.fn().mockResolvedValue(result);
      expect(await transactionController.getTransaction('1', '2')).toBe(result);
    });
  });
});
