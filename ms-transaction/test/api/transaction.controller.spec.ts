import { Test, TestingModule } from '@nestjs/testing';
import { FindByIdTransactionUseCase } from '../../src/application/use-cases/find-by-id-transaction.use-case';
import { SaveTransactionUseCase } from '../../src/application/use-cases/save-transaction.use-case';
import { DatabaseModule } from '../../src/infrastructure/database/database.module';
import { TransactionController } from '../../src/infrastructure/http/controllers/transaction.controller';
import { TransactionsMapper } from '../../src/infrastructure/http/mappers/transaction-mapper';
import { ProducerModule } from '../../src/infrastructure/messaging/producer/producer.module';
import {
  mockSaveTransaction,
  mockTransaction,
  mockTransactionDto,
} from '../mock/transaction.mock';

describe('TransactionController', () => {
  let controller: TransactionController;
  let saveTransactionUseCase: SaveTransactionUseCase;
  let findByIdTransactionUseCase: FindByIdTransactionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, ProducerModule],
      controllers: [TransactionController],
      providers: [SaveTransactionUseCase, FindByIdTransactionUseCase],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    saveTransactionUseCase = module.get<SaveTransactionUseCase>(
      SaveTransactionUseCase,
    );
    findByIdTransactionUseCase = module.get<FindByIdTransactionUseCase>(
      FindByIdTransactionUseCase,
    );
  });

  describe('getTransaction', () => {
    it('should return the transaction with the given id', async () => {
      jest
        .spyOn(findByIdTransactionUseCase, 'execute')
        .mockResolvedValue(mockTransaction);

      jest
        .spyOn(TransactionsMapper, 'toDto')
        .mockReturnValue(mockTransactionDto);

      const result = await controller.getTransaction({
        id: mockTransactionDto.externalId,
      });

      expect(findByIdTransactionUseCase.execute).toHaveBeenCalledWith(
        mockTransactionDto.externalId,
      );
      expect(TransactionsMapper.toDto).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransactionDto);
    });
  });

  describe('saveTransaction', () => {
    it('should save the transaction', async () => {
      jest
        .spyOn(saveTransactionUseCase, 'execute')
        .mockResolvedValue(undefined);

      await controller.saveTransaction(mockSaveTransaction);

      expect(saveTransactionUseCase.execute).toHaveBeenCalledWith(
        mockSaveTransaction,
      );
    });
  });
});
