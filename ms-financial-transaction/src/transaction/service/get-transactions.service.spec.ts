/* eslint-disable @typescript-eslint/unbound-method */
import { GetTransactionsService } from './get-transactions.service';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { Logger } from 'nestjs-pino';
import { Transaction } from '../entity/transaction';
import { TransactionType } from '../entity/transaction-type.enum';
import { TransactionStatus } from '../entity/transaction-status.enum';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('GetTransactionsService', () => {
  let service: GetTransactionsService;
  let transactionDbRepo: jest.Mocked<TransactionPostgresRepository>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    transactionDbRepo = {} as jest.Mocked<TransactionPostgresRepository>;
    logger = {} as jest.Mocked<Logger>;
    logger.warn = jest.fn();

    service = new GetTransactionsService(transactionDbRepo, logger);
  });

  describe('getById', () => {
    it('given a valid transaction ID, should return the transaction', async () => {
      const transaction = new Transaction(
        '123',
        100,
        'payer-123',
        'payee-456',
        TransactionType.CREDIT,
        new Date(),
        new Date(),
        TransactionStatus.PENDING,
      );
      transactionDbRepo.findById = jest.fn().mockResolvedValue(transaction);

      const result = await service.getById('123');

      expect(result).toEqual(transaction);
      expect(transactionDbRepo.findById).toHaveBeenCalledWith('123');
    });

    it('given a non-existent transaction ID, should throw NotFoundException', async () => {
      transactionDbRepo.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      expect(transactionDbRepo.findById).toHaveBeenCalledWith('nonexistent');
    });
  });
});
