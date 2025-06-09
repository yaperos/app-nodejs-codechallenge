import { Test } from '@nestjs/testing';
import TransactionServiceImpl from './transaction.service.impl';
import TransactionService from '../../domain/services/transaction.service';
import { TRANSACTION_EVENT, TRANSACTION_REPOSITORY } from '../../commons/tokens';
import TransactionRepository from '../../domain/repositories/transaction.repository';
import TransactionEvent from '../../domain/events/transaction.event';
import CreateTransaction from '../../domain/dtos/createTransaction';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';

describe('TransactionServiceImpl', () => {
  let service: TransactionService;
  let transactionEvent: jest.Mocked<TransactionEvent>;
  let transactionRepo: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    const mockEvent = {
      emitTransactionCreate: jest.fn(),
      emitTransactionGetById: jest.fn(),
    };

    const mockRepo = {
      create: jest.fn(),
      findByid: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
        { provide: TRANSACTION_EVENT, useValue: mockEvent },
        { provide: TRANSACTION_REPOSITORY, useValue: mockRepo },
      ],
    }).compile();

    service = module.get(TransactionServiceImpl);
    transactionEvent = module.get(TRANSACTION_EVENT);
    transactionRepo = module.get(TRANSACTION_REPOSITORY);
  });

  describe('create', () => {
    it('should create a transaction via event', async () => {
      const dto: CreateTransaction = {
        accountExternalIdDebit: 'acc-debit',
        accountExternalIdCredit: 'acc-credit',
        value: 1000,
        transferTypeId: 1,
      };

      const createdTransaction = createMockTransactionEntity();

      transactionEvent.emitTransactionCreate.mockResolvedValue(createdTransaction);

      const result = await service.create(dto);

      expect(transactionEvent.emitTransactionCreate).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdTransaction);
    });
  });

  describe('findById', () => {
    it('should return transaction from repository if found', async () => {
      const transactionId = 'trx-2';
      const cachedTransaction = createMockTransactionEntity();
      cachedTransaction.id = transactionId;

      transactionRepo.findByid.mockResolvedValue(cachedTransaction);

      const result = await service.findById(transactionId);

      expect(transactionRepo.findByid).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(cachedTransaction);
      expect(transactionEvent.emitTransactionGetById).not.toHaveBeenCalled();
      expect(transactionRepo.create).not.toHaveBeenCalled();
    });

    it('should fetch from event and save to cache if not found', async () => {
      const transactionId = 'trx-3';
      const fetchedTransaction = createMockTransactionEntity();
      fetchedTransaction.id = transactionId;

      transactionRepo.findByid.mockResolvedValue(undefined);
      transactionEvent.emitTransactionGetById.mockResolvedValue(fetchedTransaction);

      const result = await service.findById(transactionId);

      expect(transactionRepo.findByid).toHaveBeenCalledWith(transactionId);
      expect(transactionEvent.emitTransactionGetById).toHaveBeenCalledWith(transactionId);
      expect(transactionRepo.create).toHaveBeenCalledWith(fetchedTransaction);
      expect(result).toEqual(fetchedTransaction);
    });
  });
});
