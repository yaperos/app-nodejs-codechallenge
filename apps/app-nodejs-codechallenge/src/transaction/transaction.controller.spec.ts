import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { LoggerService } from '@app/shared';
import { UpdateResult } from 'typeorm';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionsService, LoggerService],
      imports: [],
    })
      .overrideProvider(TransactionsService)
      .useValue({
        updateTransaction: jest.fn(),
      })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateTransaction', () => {
    it('should update transaction', async () => {
      const mockTransaction: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(service, 'updateTransaction')
        .mockResolvedValue(mockTransaction);

      const result = await controller.updateTransaction({
        transactionExternalId: '80332e78-9ce2-4fbf-95d9-51449251aa71',
        status: 2,
      });

      expect(result).toEqual(JSON.stringify(mockTransaction));
    });
  });
});
